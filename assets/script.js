const makeMove = async (position) => {
  const data = await fetch(`http://localhost:3000/move?position=${position}`).then(res => res.json());
  document.getElementsByTagName("html")[0].innerHTML = data["data"]
}