(async function(){
	const joinTrigger = document.getElementById('join_trigger_button')
	const roomId = document.getElementById('room_id')
	const remoteVideos = document.getElementById('js-remote-streams');

	console.log("hello treasure");

	let localStream;

	// カメラ映像取得
	navigator.mediaDevices.getUserMedia({video: true, audio: true})
		.then( stream => {
			// 成功時にvideo要素にカメラ映像をセットし、再生
			const videoElm = document.getElementById('my-video')
			videoElm.srcObject = stream;
			videoElm.play();
			// 着信時に相手にカメラ映像を返せるように、グローバル変数に保存しておく
			localStream = stream;
		}).catch( error => {
			// 失敗時にはエラーログを出力
			console.error('mediaDevice.getUserMedia() error:', error);
			return;
		});

	const peer = new Peer({
		key: '62c11e71-110c-43e6-98e1-d3944aa627af',
		debug: 3
	});

	joinTrigger.addEventListener('click', () => {
		const roomid = roomId.value
		if (!peer.open) {
			return;
		}

		const room = peer.joinRoom(roomid, {
			method: 'mesh',
			stream: localStream,
		})

		room.on('stream', async stream => {
			const newVideo = document.createElement('video');
			newVideo.srcObject = stream;
			newVideo.playsInline = true;
			// mark peerId to find it later at peerLeave event
			newVideo.setAttribute('data-peer-id', stream.peerId);
			remoteVideos.append(newVideo);
			await newVideo.play().catch(console.error);
		});


		room.on('peerLeave', peerId => {
			const remoteVideo = remoteVideos.querySelector(
				`[data-peer-id="${peerId}"]`
			);
			remoteVideo.srcObject.getTracks().forEach(track => track.stop());
			remoteVideo.srcObject = null;
			remoteVideo.remove();
		});

		// for closing myself
		room.once('close', () => {
			Array.from(remoteVideos.children).forEach(remoteVideo => {
				remoteVideo.srcObject.getTracks().forEach(track => track.stop());
				remoteVideo.srcObject = null;
				remoteVideo.remove();
			});
		});

	})

})();
