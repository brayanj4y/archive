const whoamiObj = {
  "message": [
    [
      "In this wild simulation,",
      "I’m just vibin’, lowkey tryna figure out wtf is goin’ on —"
    ],
    [
      "While the universe’s on DND,",
      "I’m lost in my main character era,",
      "asking the same deep ass question —"
    ],
    [
      "Life’s playlist kinda hittin’,",
      "I’m one beat away from realizing my purpose,",
      "still wondering —"
    ],
    [
      "As recycled stardust with anxiety,",
      "I’m out here overthinking the cosmos,",
      "like fr, who even am I —"
    ],
    [
      "In this messy aesthetic called reality,",
      "I’m just one pixel in the group chat of existence,",
      "sending another late-night ‘what is life?’ text —"
    ],
  ],
}

export const createWhoami = (): string[] => {
  const whoami: string[] = [];
  const r = Math.floor(Math.random() * whoamiObj.message.length);
  whoami.push("<br>");

  whoamiObj.message[r].forEach((ele, idx) => {
    if (idx === whoamiObj.message[r].length - 1) {
      ele += "<span class='command'>who am I?</span>";
    }
    whoami.push(ele);
  });

  whoami.push("<br>");

  return whoami
}
