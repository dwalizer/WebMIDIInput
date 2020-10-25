let parseMessage = (message) => {
    return {
        command: message.data[0] >> 4,
        channel: message.data[0] & 0xf,
        note: message.data[1],
        velocity: message.data[2]
    };
}

let convertNoteToFrequency = (note) => {
	return 440 * Math.pow(2, (note - 69) / 12 );
}

let initializeMidiAccess = () => {
    navigator.requestMIDIAccess({sysex: false}).then((midiAccess) => {

      const inputs = midiAccess.inputs.values();
      for(let input = inputs.next(); input && !input.done; input = inputs.next()) {
          if(input.value) {
              input.value.onmidimessage = (message) => {
                  let parsedMessage = parseMessage(message);

                  switch(parsedMessage.command) {
                      case 8:
                          console.log("note released");
                          console.log("Freq: " + convertNoteToFrequency(parsedMessage.note))
                          break;
                      case 9:
                          console.log("note pressed");
                          console.log("Freq: " + convertNoteToFrequency(parsedMessage.note))
                          break;
                      default:
                          console.log("Unsupported command");
                          break;                          
                  }
              }
          }
      }
    
    }, (error) => {
        console.log("No MIDI support");
    });
}