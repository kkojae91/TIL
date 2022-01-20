const users = [
  { id: 1, name: "Lee" },
  { id: 2, name: "Kim" },
  { id: 2, name: "Choi" },
  { id: 3, name: "Park" },
];

function predicate(key, value) {
  return (item, index, arr) => {
    console.log(item, index, arr);
    return item[key] === value;
  };
}

console.log(users.findIndex(predicate("id", 2)));
