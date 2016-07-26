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
            ['', 'まえに一歩', 'move_forward'],
            ['w', 'test', 'move_forward_test'],
            ['', 'うしろに一歩', 'move_back'],
            ['h', 'when disc ejected', 'onDiskEjected'],
            ['h', 'when drive closed', 'onDriveClosed'],
        ]
    };

    let rtrobo_ext_init = function(ext) {

	let recvMsg = '';

        ext.move_forward = function() {
            //let data = {command: 'eject'};
            //ext.api.send(JSON.stringify(data), null);
            ext.api.send("RRFWD", null);
        };


        ext.move_back = function() {
            ext.api.send("RRBACK", null);
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


	ext.move_forward_test = function(callback) {
            ext.api.send("RRFWD", null);

	    checkMsg = function() {

		if (recvMsg == 'OK') {
		    recvMsg = '';
		    callback();
		}
		else {
		    setTimeout(function(){checkMsg()}, 1000);
		    console.log('checkMsg');
		}
	    }
	};
	
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
