import { useCallback } from "react";
import useSound from "use-sound";

const dir = "/sound/";

export enum SoundSelector {
  DWARF_MUMBLING_1 = "11L-a_dwarf_mumbling-1724935758394.mp3",
  DWARF_MUMBLING_2 = "11L-a_dwarf_mumbling-1724935761436.mp3",
  DWARF_MUMBLING_3 = "11L-a_dwarf_mumbling-1724935762260.mp3",
  DWARF_MUMBLING_4 = "11L-a_dwarf_mumbling-1724935763022.mp3",
  DWARF_MUMBLING_5 = "11L-a_dwarf_mumbling-1724935764955.mp3",
  DWARF_SAYING_DIGDI_1 = "11L-a_dwarf_saying_digdi-1724935770705.mp3",
  DWARF_SAYING_DIGDI_2 = "11L-a_dwarf_saying_digdi-1724935772306.mp3",
  DWARF_SAYING_DIGDI_3 = "11L-a_dwarf_saying_digdi-1724935773230.mp3",
  DWARF_SAYING_DIGDI_4 = "11L-a_dwarf_saying_digdi-1724935774017.mp3",
  DWARF_SAYING_DUGDU_1 = "11L-a_dwarf_saying_dugdu-1724935775559.mp3",
  DWARF_SAYING_DUGDU_2 = "11L-a_dwarf_saying_dugdu-1724935776302.mp3",
  DWARF_SAYING_DUGDU_3 = "11L-a_dwarf_saying_dugdu-1724935776960.mp3",
  DWARF_SAYING_DUGDU_4 = "11L-a_dwarf_saying_dugdu-1724935777816.mp3",
  DWARF_SHOUTING = "11L-a_dwarf_shouting-1724935754563.mp3",
  DWARFS_SAYING_YIPPE_1 = "dwarfs_saying_yippe_1.mp3",
  DWARFS_SAYING_YIPPE_3 = "dwarfs_saying_yippe_3.mp3",
  DWARFS_SAYING_YIPPE = "dwarfs_saying_yippe.mp3",
  DWARFS_SCREAMING_IN_1 = "dwarfs_screaming_in_1.mp3",
  DWARFS_SCREAMING_IN_2 = "dwarfs_screaming_in_2.mp3",
  DWARFS_SCREAMING_IN_3 = "dwarfs_screaming_in_3.mp3",
  DWARFS_SCREAMING_IN_4 = "dwarfs_screaming_in_4.mp3",
}

export const useUiSounds = (selector?: string) => {
  const selectedSound =
    selector ||
    Object.values(SoundSelector)[
      Math.floor(Math.random() * Object.values(SoundSelector).length)
    ];
  const [play, { stop, sound }] = useSound(dir + selectedSound, {
    volume: 10,
  });

  // const fade = useCallback(() => {
  //   sound && sound.fade(isSoundOn ? effectsLevel / 100 : 0, 0, 250);
  // }, [effectsLevel, isSoundOn, sound]);

  const repeat = useCallback(() => {
    if (sound) {
      sound.loop(true);
      play();
    }
  }, [sound, play]);

  return {
    play,
    stop,
    //   fade,
    repeat,
  };
};
