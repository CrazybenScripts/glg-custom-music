pub async fn process_data(data: &str, player: &AudioPlayer) {
    let p_data: MessageFormat = serde_json::from_str(data).expect("Error parsing JSON");

    match p_data.msgType.as_str() {
        "bgm" => {
            if let Some(audio_url) = &p_data.audioUrl {
                player.play_audio(audio_url).await;
            }
        },
        "gameStatus" => {
            match p_data.statusType.as_deref() {
                Some("died") => player.set_volume(0.5),
                Some("left") => player.stop(),
                _ => {}
            }
        },
        _ => {}
    }
}
