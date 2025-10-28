/*
2023/01/01
#genuary1 "Perfect loop / Infinite loop / endless GIFs"
@senbaku
*/

// 已修正可執行版：保留原始變數與核心行為，補上缺失函式

let mover = [];
let num;
let rnum;
let points;
let count = 3;
let w;
let pg;

const menuX = 25;
const menuY = 25;
const menuW = 220;
const menuH = 40;
const menuItems = ["爆破氣球", "爆破氣球的講義", "回到主頁"];
const menuLinks = [
  "https://tttsai1215.github.io/20251014new/",
  "https://hackmd.io/@3OvxlZiGSxyFx5MGHXqTYQ/H1Y4qu1nge",
  ""
];

function setup() {
  rnum = random(100);
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  w = min(windowWidth, windowHeight) / count;
  let radius = w / 2;
  points = 4;
  num = 360 / points;

  // 初始化 mover 陣列（簡化為 points 個 Mover）
  mover = [];
  for (let j = 0; j < points; j++) {
    // 使用角度與半徑建立不同位置
    let ang = j * (360 / points);
    let ex = radius * sin(ang);
    let ey = radius * cos(ang);
    let ex2 = radius * sin(ang + 45);
    let ey2 = radius * cos(ang + 45);
    mover.push(new Mover(ex, ey, ex2, ey2, radius, j));
  }

  // rain texture
  pg = createGraphics(width, height);
  pg.noFill();
  for (let i = 0; i < 3000; i++) {
    let x = random(width);
    let y = random(height);
    let n = noise(x * 0.01, y * 0.01) * width * 0.01;
    pg.stroke(100);
    pg.line(x, y, x, y + n);
  }
}

function draw() {
  if (mode === 'main') {
    background(51);
    image(pg, 0, 0);

    randomSeed(rnum);
    tile();

    // ====== 顯示中央標題（使用你指定的文字） ======
    push();
    textAlign(CENTER, CENTER);
    // 依照較長邊等比例放大字體
    let baseSize = 96;
    let scaleFactor = max(width, height) / 1000;
    textSize(baseSize * scaleFactor);
    stroke(0, 180); // 黑色陰影
    strokeWeight(8);
    fill(255); // 白色字
    text("414730134\n蔡忞序", width / 2, height / 2);
    pop();
    // =========================

    // 顯示選單（滑鼠靠近左上方時）
    if (mouseX < 120 && mouseY < 120) {
      showMenu();
    }
  } else if (mode === 'balloons') {
    drawBalloonsScene();
  }
}

// 簡單的 tile()：把 mover 的形狀重複平鋪（等比例填滿畫面，以較長邊為依據）
function tile() {
  // 計算等比例 step（以較短邊做格子數，較長邊等比延伸）
  const baseStep = 60;
  const baseGrid = 10; // 基準格數（短邊）
  // 讓格子以短邊為基準，長邊延伸以填滿畫面
  const short = min(width, height);
  const long = max(width, height);
  const step = baseStep * (short / (baseGrid * baseStep));
  const cols = ceil(width / step) + 1;
  const rows = ceil(height / step) + 1;

  // 中心偏移計算，確保格點以等比例填滿並置中
  const totalW = cols * step;
  const totalH = rows * step;
  const dx = (width - totalW) / 2;
  const dy = (height - totalH) / 2;

  push();
  translate(dx, dy);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      push();
      translate(i * step, j * step);
      // 畫一個簡化的圖形，使用 mover 陣列決定顏色/大小
      let idx = (i + j) % mover.length;
      mover[idx].displayAt(0, 0);
      pop();
    }
  }
  pop();
}

function showMenu() {
  push();
  noStroke();
  fill(30, 200);
  rect(0, 0, menuW, height);

  textSize(18);
  fill(255);
  textAlign(LEFT, TOP);
  let y = 30;
  for (let i = 0; i < menuItems.length; i++) {
    // 按鈕外觀
    fill(255, 20);
    rect(10, y - 6, menuW - 20, menuH);
    fill(255);
    noStroke();
    text(menuItems[i], 20, y);
    y += menuH + 12;
  }
  pop();
}

// 簡化的 mousePressed：判斷在選單時點選（第一個按鈕示範）
function mousePressed() {
  if (mouseX < menuW && mouseY < 200) {
    // 判斷第一個按鈕 (爆炸圓形)
    if (mouseY > 24 && mouseY < 24 + menuH) {
      // 開啟 GitHub 頁面並啟動爆破動畫
      if (menuLinks[0]) window.open(menuLinks[0], "_blank");
      startBalloons();
      return;
    }
    // 第二個按鈕：開啟外部連結範例
    if (mouseY > 24 + (menuH + 12) && mouseY < 24 + (menuH + 12) + menuH) {
      if (menuLinks[1]) window.open(menuLinks[1], "_blank");
      return;
    }
    // 第三個按鈕：回到主頁
    if (mouseY > 24 + 2 * (menuH + 12) && mouseY < 24 + 2 * (menuH + 12) + menuH) {
      mode = 'main';
      return;
    }
  }
}

// 簡化的 Mover 類別（用來畫小圖形）
class Mover {
  constructor(x1, y1, x2, y2, radius, id) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.r = radius;
    this.id = id;
    // 改為白色與淺藍色交替（以呈現你要求的圓圈顏色）
    if (id % 2 === 0) {
      this.col = color(255, 255, 255); // 白色
    } else {
      this.col = color(180, 220, 255); // 淺藍
    }
  }

  displayAt(dx, dy) {
    push();
    translate(dx, dy);
    noStroke();
    fill(this.col);
    // 畫兩個小圓與線，形成簡單圖形
    ellipse(this.x1 + this.r, this.y1 + this.r, this.r * 0.6);
    ellipse(this.x2 + this.r, this.y2 + this.r, this.r * 0.4);
    stroke(255, 30);
    line(this.x1 + this.r, this.y1 + this.r, this.x2 + this.r, this.y2 + this.r);
    pop();
  }
}

// 簡單爆破氣球功能（建立並顯示幾個圓與粒子）
let mode = 'main';
let circles = [];
let particles = [];
const palette = [
  [230, 180, 255],
  [200, 150, 250],
  [160, 200, 255],
  [140, 170, 255],
  [120, 190, 230]
];

function startBalloons() {
  mode = 'balloons';
  circles = [];
  particles = [];
  for (let i = 0; i < 12; i++) {
    let baseColor = palette[int(random(palette.length))];
    let r = random(50, 200);
    circles.push({
      x: random(width),
      y: random(height, height * 1.5),
      r: r,
      c: [baseColor[0], baseColor[1], baseColor[2], random(120, 200)]
    });
  }
  // 進入爆破循環（短暫）
  let duration = 6000;
  setTimeout(() => { mode = 'main'; }, duration);
}

function drawBalloonsScene() {
  background(200, 182, 255);
  noStroke();
  for (let i = 0; i < circles.length; i++) {
    let c = circles[i];
    fill(c.c[0], c.c[1], c.c[2], c.c[3]);
    ellipse(c.x, c.y, c.r, c.r);
    let speed = map(c.r, 50, 300, 6, 1);
    c.y -= speed * 0.6;
    if (c.y < -c.r / 2) {
      c.y = height + c.r / 2;
    }
  }

  // 若需要可在此加入爆破點擊檢測與粒子更新（目前保留簡單顯示）
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 重新建立 rain texture
  pg = createGraphics(width, height);
  pg.noFill();
  for (let i = 0; i < 3000; i++) {
    let x = random(width);
    let y = random(height);
    let n = noise(x * 0.01, y * 0.01) * width * 0.01;
    pg.stroke(100);
    pg.line(x, y, x, y + n);
  }
}