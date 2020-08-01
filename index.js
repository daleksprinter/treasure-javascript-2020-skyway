(function(){
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
    // try{
    //     const localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
    //     const videoElement = document.getElementById("my-video");
    //     videoElement.srcObject = localStream;
    //     videoElement.play();
    // }catch(error){
    //     alert(error);
    // }

    const peer = new Peer({
        key: '62c11e71-110c-43e6-98e1-d3944aa627af',
        debug: 3
    });
    
    peer.on('open', () => {
        document.getElementById('my-id').textContent = peer.id;
    });


    document.getElementById('make-call').onclick = () => {
        const theirID = document.getElementById('their-id').value;
        const mediaConnection = peer.call(theirID, localStream);
        setEventListener(mediaConnection);
      };
      
      // イベントリスナを設置する関数
      const setEventListener = mediaConnection => {
        mediaConnection.on('stream', stream => {
          // video要素にカメラ映像をセットして再生
          const videoElm = document.getElementById('their-video')
          videoElm.srcObject = stream;
          videoElm.play();
        });
      }

      peer.on('call', mediaConnection => {
        mediaConnection.answer(localStream);
        setEventListener(mediaConnection);
      });
})();