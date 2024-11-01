pub struct AudioPlayer {
    sink: Sink,
}

impl AudioPlayer {
    pub fn new() -> Self {
        let (_stream, stream_handle) = OutputStream::try_default().expect("Failed to create audio stream");
        let sink = Sink::try_new(&stream_handle).expect("Failed to create audio sink");
        Self { sink }
    }

    pub async fn play_audio(&self, url: &str) {
        self.sink.stop();
        let temp_dir = tempdir().expect("Failed to create temporary directory");
        let file_extension = url.split('.').last().unwrap();
        let file_name = Uuid::new_v4().to_string() + "." + file_extension;

        let client = Client::new();
        let response = client.get(url).send().await.expect("Failed to send request");
        let file_path = temp_dir.path().join(&file_name);
        let mut file = File::create(&file_path).expect("Failed to create file");
        file.write_all(&response.bytes().await.expect("Failed to read response body")).expect("Failed to save file");

        let file = File::open(file_path).expect("Failed to open audio file");
        let decoder = Decoder::new(BufReader::new(file)).expect("Failed to decode audio file");
        self.sink.append(decoder);
        self.sink.play();
    }
