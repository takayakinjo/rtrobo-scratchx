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
    let ext_ = this;

    // Extension name
    let name = 'RtRobo Controller';

    // Block and block menu descriptions
    let descriptor = {
        blocks: [
            ['w', '%s にせつぞく', 'connect'],
            ['w', 'せつだん', 'disconnect'],
            ['w', 'まえに一歩', 'move_forward'],
            ['w', 'うしろに一歩', 'move_back'],
            ['w', '右に %n 度まわる', 'turn_right', 90],
            ['w', '左に %n 度まわる', 'turn_left', 90],
            ['w', 'くっしん', 'bend'],
            ['w', 'きりつ', 'neutral'],
            ['w', 'すわる', 'sit_down'],
            [' ', '%s と言う', 'speak'],
	    ['r', 'きょりが %n cm より %m.lessMore とき', 'getDistance', 20, '近い'],
        ],
	menus: {
            motorDirection: ['this way', 'that way', 'reverse'],
            lessMore: ['近い', '遠い'],
            eNe: ['=','not =']
	},
    };

    let rtrobo_ext_init = function(ext) {

	let recvMsg = '';

        //ext.move_forward = function() {
            //let data = {command: 'eject'};
            //ext.api.send(JSON.stringify(data), null);
        //    ext.api.send("RRFWD", null);
        //};


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

        ext.turn_right = function(deg, callback) {
            ext.api.send("RRTRNR:"+deg, null);

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

        ext.turn_left = function(deg, callback) {
            ext.api.send("RRTRNL:"+deg, null);

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

        ext.getDistance = function(dist, lessMore) {
            ext.api.send("RRGETDST:" + dist + ":" + lessMore, null);
        };

	let prev_state = '';
	let curr_state = '';
	
        ext.api.setInternalEventCheckHook( function(event) {
            return true;
        });

        ext.api.addEventListener('message-received', function(event) {
            //let recv = JSON.parse(event.data);
            let recv = event.data;

	    console.log('Received: ' + recv);

	    recvMsg = recv;
	    
            if(recv.status != undefined) {
		curr_state = recv.status;
            }
        });

	let state_check = function(check_state) {
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

    let scriptpath = document.currentScript.src.match(/.*\//);
    $.getScript(scriptpath + 'ws-ext.js')
        .done( function(ws_ext, textStatus) {
            let eventTarget = document.createDocumentFragment();
            ws_ext_init(ext_, eventTarget);
            rtrobo_ext_init(ext_);
        });

})();
