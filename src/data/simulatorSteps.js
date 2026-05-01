export const simulatorSteps = [
  {
    title: 'Arrive at Polling Booth',
    content:
      'You have arrived at your designated polling booth. Look for the booth number on your voter slip. Polling hours are 7:00 AM to 6:00 PM.',
    icon: 'how_to_vote',
    type: 'info',
  },
  {
    title: 'Document Check',
    content: 'Before entering, make sure you have all required documents.',
    type: 'checklist',
    items: [
      {
        id: 'epic',
        label: 'Voter ID Card (EPIC) or any of 12 accepted alternatives',
      },
      { id: 'slip', label: 'Booth slip (received before election day)' },
      { id: 'photo', label: 'One additional photo ID proof' },
    ],
  },
  {
    title: 'Identity Verification',
    challengeId: 1,
    content:
      "A man in plain clothes approaches you and says: 'Come with me, I'll take you directly to the voting machine. No need to wait in line.'",
    type: 'challenge',
    options: [
      {
        id: 'A',
        label: 'Follow him, it saves time',
        isCorrect: false,
        feedback:
          'Wrong choice. This is a common election fraud tactic. Voting must follow the official queue only. Polling agents cannot guide individual voters. This violates the Model Code of Conduct.',
      },
      {
        id: 'B',
        label: 'Refuse and report to the officer',
        isCorrect: true,
        feedback:
          'Correct. You protected your vote. Under the Model Code of Conduct, no unauthorized person can guide voters inside a booth.',
      },
    ],
  },
  {
    title: 'Sign the Voter Register',
    content:
      'The polling officer will ask you to sign or put your thumb impression in the voter register against your name and serial number.',
    type: 'signature',
  },
  {
    title: 'Ink Marking',
    content:
      'The officer will apply indelible ink on the index finger of your left hand. This ink cannot be washed off and lasts 2-3 weeks. It prevents double voting.',
    type: 'ink',
  },
  {
    title: 'Enter Voting Area',
    challengeId: 2,
    content:
      "Outside the voting compartment, a person says: 'Our party will give you ₹500 after you vote for us. Just show us your phone screen after voting.'",
    type: 'challenge',
    options: [
      {
        id: 'A',
        label: 'Agree, ₹500 is useful',
        isCorrect: false,
        feedback:
          'Wrong. Accepting money to vote is a criminal offence under IPC Section 171B punishable with up to 1 year imprisonment or fine or both. Your ballot is also secret — showing it to anyone is impossible and unnecessary.',
      },
      {
        id: 'B',
        label: 'Refuse and report to Presiding Officer',
        isCorrect: true,
        feedback:
          'Correct. You reported a bribery attempt. The Presiding Officer will handle this. You can also report via cVIGIL app for faster action.',
      },
    ],
  },
  {
    title: 'EVM Voting',
    content:
      'You are inside the voting compartment. The EVM is in front of you. Press the button next to your chosen candidate. You have one vote only.',
    type: 'evm',
  },
  {
    title: 'VVPAT Verification',
    content:
      "After pressing the EVM button, a paper slip appears in the VVPAT glass window for 7 seconds showing your chosen candidate's name and symbol.",
    type: 'vvpat',
  },
  {
    title: 'Vote Complete',
    type: 'complete',
  },
];
