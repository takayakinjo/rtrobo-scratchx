/*
  Copyright (c) 2016 Takaya Kinjo  All right reserved.

  This library is free software; you can redistribute it and/or
  modify it under the terms of the GNU Lesser General Public
  License as published by the Free Software Foundation; either
  version 2.1 of the License, or (at your option) any later version.

  This library is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  See the GNU Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public
  License along with this library; if not, write to the Free Software
  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

new (function() {
    var ext_ = this;

    // Extension name
    var name = 'RtRobo Controller';

    // Check for GET param 'lang'
    var paramString = window.location.search.replace(/^\?|\/$/g, '');
    var vars = paramString.split("&");
    var lang = 'ja';
    for (var i=0; i<vars.length; i++) {
	var pair = vars[i].split('=');
	if (pair.length > 1 && pair[0]=='lang') {
	    lang = pair[1];
//	    alert(lang);
	}
    }
    
    var blocks = {
        en: [
            ['w', 'Connect to %s', 'connect', 'ws://localhost:9000/rtrobo'],
            ['w', 'Disconnect', 'disconnect'],
            ['w', 'Step forward', 'move_forward'],
            ['w', 'Step Backward', 'move_back'],
            ['w', 'Turn %m.rightLeft %n degree', 'turn', 'Right', 90],
            ['w', 'Bending', 'bend'],
            ['w', 'Stand up', 'neutral'],
            ['w', 'Sit down', 'sit_down'],
            [' ', 'Move %m.upDown %m.hands', 'move_hand', 'Up', 'Right hand'],
            [' ', 'say %s', 'speak', 'hello'],
	    ['b', 'If distance is %m.lessMore than %n cm', 'getDistance', 'nearer', 20],
        ],
        ja: [
            ['w', '%s にせつぞく', 'connect', 'ws://localhost:9000/rtrobo'],
            ['w', 'せつだん', 'disconnect'],
            ['w', 'まえに一歩', 'move_forward'],
            ['w', 'うしろに一歩', 'move_back'],
            ['w', '%m.rightLeft に %n 度まわる', 'turn', '右', 90],
            ['w', 'くっしん', 'bend'],
            ['w', 'きりつ', 'neutral'],
            ['w', 'すわる', 'sit_down'],
            [' ', '%m.hands を %m.upDown', 'move_hand', '右手', 'あげる'],
            [' ', '%s と言う', 'speak', 'こんにちは'],
	    ['b', 'きょりが %n cm より %m.lessMore とき', 'getDistance', 20, '近い'],
            [' ', 'カメラきどう', 'cameraStart']
        ]
    };
    var menus = {
	en: {
            rightLeft: ['right', 'left'],
            hands: ['Right hand', 'Left hand'],
            upDown: ['up', 'down'],
            lessMore: ['nearer', 'farther'],
            eNe: ['=','not =']
	},
	ja: {
            rightLeft: ['右', '左'],
            hands: ['右手', '左手'],
            upDown: ['あげる', 'さげる'],
            lessMore: ['近い', '遠い'],
            eNe: ['=','not =']
	}
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: blocks[lang],
	menus: menus[lang]
    };

    var rtrobo_ext_init = function(ext) {

	var recvMsg = '';

        //ext.move_forward = function() {
            //var data = {command: 'eject'};
            //ext.api.send(JSON.stringify(data), null);
        //    ext.api.send("RRFWD", null);
        //};

	ext.cameraStart = function() {
	    window.open("http://www.macchinito.com", "RoboCam", "width=320, height=200");
	}
	
	ext.move_forward = function(callback) {
            ext.api.send("RRFWD", null);

	    checkMsg = function() {
		if (recvMsg == 'OK') {
		    console.log('Got OK');
		    recvMsg = '';
		    callback();
		} else {
		    setTimeout(function(){checkMsg()}, 100);
		}
	    };
	    checkMsg();
	};
	

        ext.move_back = function(callback) {
            ext.api.send("RRBACK", null);

	    checkMsg = function() {
		if (recvMsg == 'OK') {
		    console.log('Got OK');
		    recvMsg = '';
		    callback();
		} else {
		    setTimeout(function(){checkMsg()}, 100);
		}
	    };
	    checkMsg();
        };

        ext.bend = function(callback) {
            ext.api.send("RRBEND", null);

	    checkMsg = function() {
		if (recvMsg == 'OK') {
		    console.log('Got OK');
		    recvMsg = '';
		    callback();
		} else {
		    setTimeout(function(){checkMsg()}, 100);
		}
	    };
	    checkMsg();
        };

        ext.neutral = function(callback) {
            ext.api.send("RRNTRL", null);

	    checkMsg = function() {
		if (recvMsg == 'OK') {
		    console.log('Got OK');
		    recvMsg = '';
		    callback();
		} else {
		    setTimeout(function(){checkMsg()}, 100);
		}
	    };
	    checkMsg();
        };

        ext.sit_down = function(callback) {
            ext.api.send("RRCTDN", null);

	    checkMsg = function() {
		if (recvMsg == 'OK') {
		    console.log('Got OK');
		    recvMsg = '';
		    callback();
		} else {
		    setTimeout(function(){checkMsg()}, 100);
		}
	    };
	    checkMsg();
        };

        ext.turn = function(dir, deg, callback) {
            ext.api.send("RRTURN:"+dir+":"+deg, null);

	    checkMsg = function() {
		if (recvMsg == 'OK') {
		    console.log('Got OK');
		    recvMsg = '';
		    callback();
		} else {
		    setTimeout(function(){checkMsg()}, 100);
		}
	    };
	    checkMsg();
        };

        ext.speak = function(string) {
            ext.api.send("RRSPK:" + string, null);
        };

        ext.move_hand = function(dir, upDown) {
            ext.api.send("RRHND:" + dir + ":" + upDown, null);
        };

        ext.getDistance = function(dist, lessMore) {

	    // TESTCODE
	    if (dist > 20)
		return true;
	    else
		return false;
	    
	};

	var prev_state = '';
	var curr_state = '';
	
        ext.api.setInternalEventCheckHook( function(event) {
            return true;
        });

        ext.api.addEventListener('message-received', function(event) {
            //var recv = JSON.parse(event.data);
            var recv = event.data;

	    console.log('Received: ' + recv);

	    recvMsg = recv;
	    
            if(recv.status != undefined) {
		curr_state = recv.status;
            }
        });

	var state_check = function(check_state) {
	    if(prev_state != curr_state && curr_state == check_state) {
		prev_state = curr_state;
                return true;
            }
            return false;
        };

	ext.getMsg = function() { return recvMsg; }
	
        ext.onDiskEjected = function() { return state_check('ejected'); }
        ext.onDriveClosed = function() { return state_check('closed'); }

        // Register the extension
        ScratchExtensions.register(name, descriptor, ext);
    };

    var scriptpath = document.currentScript.src.match(/.*\//);
    $.getScript(scriptpath + 'ws-ext.js')
        .done( function(ws_ext, textStatus) {
            var eventTarget = document.createDocumentFragment();
            ws_ext_init(ext_, eventTarget);
            rtrobo_ext_init(ext_);
        });

})();
