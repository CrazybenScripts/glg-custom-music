async fn websocket_connect(username: String) {
    let url = url::Url::parse("ws://client.fe2.io:8081").unwrap();
    let (ws_stream, _) = connect_async(url).await.expect("Failed to connect");

    let (mut write, read) = ws_stream.split();
    write.send(Message::Text(username)).await.unwrap();

    let player = Arc::new(AudioPlayer::new());
    let read_future = read.for_each(|message| {
        let player = Arc::clone(&player);
        async move {
            let data = message.unwrap().into_data();
            if let Ok(string_data) = String::from_utf8(data.clone()) {
                process_data(&string_data, &player).await;
            }
        }
    });

    read_future.await;
}
