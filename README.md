Backer Timetracker
---

Application that tracks your time by monitoring your active windows (only titles) and idle time.

# Supported
- Windows (Tested win 10)
- OS X (Tested El Capitan)

# Features
- Zoomable/Pannable timechart (d3)
- View application history in timechart
- View state(online, offline, idle) histroy in timechart
- Add work log items with modal window
- Add work log item when selecting timeframe in LogTrackItem lane
- Edit work log items. Clicking opens title/color editor. Time can be changed by moving selection handles.
- View work log items in timechart
- View work log summary


![alt text](https://github.com/MayGo/timetracker-electron/raw/master/screenshots/timeline.PNG "Timetracker screenshot")

Development
---
Project is boilerplated from [https://github.com/chuyik/electron-boilerplate](https://github.com/chuyik/electron-boilerplate)

### Quick Start
> Prerequisites: [Node](https://nodejs.org/), [Git](https://git-scm.com/).

```bash
git clone https://github.com/Maygo/timetracker-electron.git  # Download this project

### Ignore this if you're not behind GFW
export ELECTRON_MIRROR=https://npm.taobao.org/mirrors/electron/

cd timetracker-electron  # Switch directory
npm install              # Install dependencies
gulp                     # Start application
```

### Gulp Commands
```bash
# Most Frequently Used
gulp dev     # [default] Run the app in debugging mode (Reload automatically)
gulp run     # Run the app in production mode

# Other available commands
gulp serve     # Run the app in debugging mode (Reload with CMD+R/F5)
gulp prebuild  # Package OSX app for predistribution (Mainly for preview)
gulp build     # Package windows and OSX app for distribution
gulp sass      # Compile SASS files
```

### Packaging & Distribution
Remember to install asar via npm before you package the application for the first time.

You could run `npm i asar -g`, and then run `gulp build`.

After built, the dist files should be saved to `output` folder by default.

# License
GNU General Public License v2.0
Copyright (c) 2016 Maigo Erit

