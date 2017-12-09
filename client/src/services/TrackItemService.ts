
import * as moment from 'moment';
import { ITrackItem } from '../@types/ITrackItem';

const remote = (<any>window).nodeRequire('electron').remote;
let ipcRenderer: any = (<any>window).nodeRequire('electron').ipcRenderer;

export class TrackItemService {
  static service:any=remote.getGlobal('TrackItemService');

  /*  findAllItems(from, to, taskName, searchStr, paging) {
          return TrackItemService.service.findAllFromDay(from, to, taskName, searchStr, paging);
      }*/

      static findAllDayItems(from:Date, to:Date, taskName:string): Promise<any> {
    return TrackItemService.service.findAllDayItems(from, to, taskName);
  }

  static findAllFromDay(from: Date, type: string): Promise<any> {
    console.log('findAllFromDay', from, type)
    return TrackItemService.service.findAllFromDay(from, type);
  }

  static findFirstLogItems(): Promise<any> {
    return TrackItemService.service.findFirstLogItems();
  }

  static createItem(trackItem:ITrackItem): Promise<any> {
    return TrackItemService.service.createTrackItem(trackItem);
  }

  static  updateItem(trackItem:ITrackItem): Promise<any> {
    return TrackItemService.service.updateItem(trackItem);
  }

  static deleteById(trackItemId:number) {
    return TrackItemService.service.deleteById(trackItemId);
  }
  static deleteByIds(trackItemId:number) {
    return TrackItemService.service.deleteByIds(trackItemId);
  }

  static startNewLogItem(oldItem: any) {
    console.log('startNewLogItem');

    let newItem: any = {};
    newItem.app = oldItem.app || 'WORK';
    newItem.taskName = 'LogTrackItem';
    newItem.color = oldItem.color;
    newItem.title = oldItem.title;
    newItem.beginDate = moment().toDate();
    newItem.endDate = moment()
      .add(60, 'seconds')
      .toDate();

    ipcRenderer.send('start-new-log-item', newItem);
  }

  static stopRunningLogItem(runningLogItemId:number) {
    console.log('stopRunningLogItem', runningLogItemId);
    ipcRenderer.send('end-running-log-item');
  }

  static updateColorForApp(appName:string, color:string) {
    return TrackItemService.service.updateColorForApp(appName, color);
  }
}