

export class SoundService {

   playAudio() {
    const audio = new Audio();
    audio.src = '/../../assets/ding.mp3';
    audio.load();
    audio.play();
  }
}
