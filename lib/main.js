var pageMod = require('sdk/page-mod'),
  simpleStorage = require('sdk/simple-storage'),
  self = require("sdk/self");

if(!simpleStorage.storage.friendsList){
  simpleStorage.storage.friendsList = [];
}

if(!simpleStorage.storage.settings){
  simpleStorage.storage.settings = {};
}

function setting_get(name){
  if(simpleStorage.storage.settings[name]){
    return simpleStorage.storage.settings[name];
  } else {
    return false;
  }
}

function setting_set(name, val){
  simpleStorage.storage.settings[name] = val;
}

pageMod.PageMod({
  include: "*.ycombinator.com",
//  contentScript: "alert('asdf');"
  contentScriptFile: self.data.url('../lib/linker.js'),
  contentScriptWhen: 'end',
  onAttach: function(worker) {

    worker.port.on("getSetting", function(name) {
      console.log(name);
      worker.port.emit('getSettingCB', setting_get(name));
    });

    worker.port.on('addFriend', function(name){
      if(simpleStorage.storage.friendsList.indexOf(name) === -1){
        simpleStorage.storage.friendsList.push(name);
      }

      worker.port.emit('addFriendCB', simpleStorage.storage.friendsList);
    });

    worker.port.on('deleteFriend', function(name){
      if(simpleStorage.storage.friendsList.indexOf(name) !== -1){
        delete simpleStorage.storage.friendsList[name];
      }

      worker.port.emit('deleteFriendCB', simpleStorage.storage.friendsList);
    });

    worker.port.on('getFriends', function(){
      worker.port.emit('getFriendsCB', simpleStorage.storage.friendsList);
    })
  }
});
