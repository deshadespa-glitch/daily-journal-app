
const DummyPost = [
  {
    id: 1,
    date: new Date().toISOString(), // today
    time: "10:30 AM",
    comment: "Had a great breakfast!",
    mood: "Happy",
    photo: "https://placekitten.com/200/200",
  },
  {
    id: 2,
    date: new Date().toISOString(), // today
    time: "3:15 PM",
    comment: "Feeling a bit down after class.",
    mood: "Sad",
    photo: null,
  },
  {
    id: 3,
    date: new Date("2025-08-29"), // previous day
    time: "8:00 PM",
    comment: "Watched a fun movie with friends!",
    mood: "Smiling",
    photo: "https://placekitten.com/250/250",
  },
];

export default DummyPost;
