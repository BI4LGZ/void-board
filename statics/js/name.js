let names = [];
let index = 0;

// 从 JSON 文件中获取人名
async function fetchNames() {
  try {
    const response = await fetch("/statics/data/names.json");
    if (!response.ok) {
      throw new Error("网络响应不正常");
    }
    const data = await response.json();
    names = data.names;
    names = shuffle(names); // 打乱顺序
  } catch (error) {
    console.error("获取名单时出错:", error);
    alert(
      "无法加载名单信息，请检查网络或联系网站管理员\n邮箱：oscarzhu@aliyun.com"
    );
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

let drawButton = document.getElementById("draw");
let resultText = document.getElementById("result");

// 初始化时获取人名
fetchNames().then(() => {
  drawButton.addEventListener("click", () => {
    if (index >= names.length) {
      names = shuffle(names);
      index = 0;
    }

    let name = names[index];
    resultText.textContent = name;

    index += 1;
  });
});
