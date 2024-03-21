const makeMove = async (position, path) => {
  console.log("origin: ",origin)
  console.log("path: ",path)
  const data = await fetch(`${path}/move?position=${position}`).then(res => res.json());
  document.getElementsByTagName("html")[0].innerHTML = data["data"]
}