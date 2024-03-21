const makeMove = async (position, root_url) => {
  const data = await fetch(`${root_url}/move?position=${position}`).then(res => res.json());
  document.getElementsByTagName("html")[0].innerHTML = data["data"]
}