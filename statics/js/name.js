let names = [];
let index = 0;

async function fetchNames() {
  try {
    const response = await fetch("/statics/data/names.json");
    if (!response.ok) throw new Error("网络响应不正常");
    const data = await response.json();
    names = shuffle(data.names);
    return true;
  } catch (error) {
    console.error("获取名单时出错:", error);
    throw error;
  }
}

function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue = "",
    randomIndex = 0;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

document.addEventListener("DOMContentLoaded", () => {
  const drawButton = document.getElementById("draw");
  const resultText = document.getElementById("result");

  drawButton.addEventListener("click", () => {
    if (!names.length) {
      resultText.textContent = "名单未加载";
      return;
    }

    if (index >= names.length) {
      names = shuffle(names);
      index = 0;
    }

    let name = names[index];
    resultText.textContent = name;

    index += 1;
  });
});
