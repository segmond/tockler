import * as moment from 'moment';
import { TimeSeries, TimeRangeEvent, TimeRange } from 'pondjs';
import { delay } from 'dva/saga';

import { TrackItemService } from '../services/TrackItemService';
import { TrackItemType } from '../enum/TrackItemType';
import { ITrackItem } from '../@types/ITrackItem';
import { ITimelineState } from '../@types/ITimelineState';

const handleTimelineItems = (
    state: ITimelineState,
    payload: { trackItems: ITrackItem[]; trackItemType: TrackItemType },
): ITimelineState => {
    const events = payload.trackItems.map(
        ({ beginDate, endDate, ...data }) =>
            new TimeRangeEvent(new TimeRange(new Date(beginDate), new Date(endDate)), data),
    );
    const trackItemSeries = new TimeSeries({ name: 'outages', events });
    // const timerange = trackItemSeries.timerange();

    return {
        ...state,
        [payload.trackItemType]: trackItemSeries,
    };
};

export const timelineModel: any = {
    namespace: 'timeline',
    state: {
        AppTrackItem: new TimeSeries({ name: 'outages', events: [] }),
        StatusTrackItem: new TimeSeries({ name: 'outages', events: [] }),
        timerange: new TimeRange(
            moment()
                .subtract(1, 'days')
                .toDate(),
            new Date(),
        ),
    },
    subscriptions: {
        setup({ dispatch }: any) {
            console.log('Timeline data setup');
            // dispatch({ type: 'bgSync' });

            const beginDate = moment().startOf('day');
            const endDate = moment().endOf('day');
            dispatch({
                type: 'loadTimerange',
                payload: { timerange: new TimeRange(beginDate, endDate) },
            });
        },
    },
    reducers: {
        loadTimelineItems(state: any, { payload }: any) {
            return handleTimelineItems(state, payload);
        },
        setTimerange(state: any, { payload: { timerange } }: any) {
            return {
                ...state,
                timerange,
            };
        },
    },
    effects: {
        *changeVisibleTimerange({ payload: { timerange } }: any, { call, put }: any) {
            console.log('Visible timerange changed:', timerange);
            yield put({
                type: 'setTimerange',
                payload: { timerange },
            });
        },
        *loadTimerange({ payload: { timerange } }: any, { call, put }: any) {
            console.log('Change timerange:', timerange);

            const trackItems: ITrackItem[] = yield call(
                TrackItemService.findAllDayItems,
                timerange.begin(),
                timerange.end(),
                TrackItemType.AppTrackItem,
            );
            yield put({
                type: 'loadTimelineItems',
                payload: { trackItems, trackItemType: TrackItemType.AppTrackItem },
            });
            yield put({
                type: 'setTimerange',
                payload: { timerange },
            });
        },
        *bgSync(action: any, { call, put }: any) {
            const delayMs = 10000;
            try {
                while (true) {
                    console.log('Timeline loading');
                    const day = moment()
                        .startOf('day')
                        .toDate();

                    let trackItems: ITrackItem[] = yield call(
                        TrackItemService.findAllFromDay,
                        day,
                        TrackItemType.AppTrackItem,
                    );
                    yield put({
                        type: 'loadTimelineItems',
                        payload: { trackItems, trackItemType: TrackItemType.AppTrackItem },
                    });

                    trackItems = yield call(
                        TrackItemService.findAllFromDay,
                        day,
                        TrackItemType.StatusTrackItem,
                    );

                    yield put({
                        type: 'loadTimelineItems',
                        payload: { trackItems, trackItemType: TrackItemType.StatusTrackItem },
                    });

                    console.log('Loaded timeline:', trackItems);
                    yield call(delay, delayMs);
                }
            } catch (err) {
                console.log(err);
            }
        },
    },
};