const c = document.querySelector("canvas"),
  $ = c.getContext("2d"),
  color = document.querySelector("#color");

let colorFill = "red"; // цвет заливки фигур
color.addEventListener("input", (e) => {
  colorFill = e.target.value;
});

function generateCanvas() {
  let shapeForm = "squares"; // фигура
  let shapeWidth = 15; // высота клеточки
  let shapeNumber = 30; // всего клеток на поле
  let shapeAmount = Math.pow(shapeNumber, 2);
  let backColor = "#fff"; // начальная заливка

  let W = (H = shapeWidth * shapeNumber);
  c.setAttribute("width", W);
  c.setAttribute("height", H);
  c.style.display = "block";

  let border = 1;
  let borderColor = "rgba(0,0,0,.4)";

  if (shapeForm === "squares") squares();

  function squares() {
    let x = (y = 0);
    let squares = [];
    let w = (h = shapeWidth);

    // статус для кисточки
    let draw = false;
    function toggleDraw() {
      draw = !draw;
    }

    c.addEventListener("mousedown", toggleDraw);
    c.addEventListener("mouseup", toggleDraw);

    document.querySelector(".clear").onclick = () => {
      x = y = 0;
      squares = [];
      w = h = shapeWidth;
      addSquares();
    };

    addSquares();

    function Square(x, y) {
      this.x = x;
      this.y = y;
      this.color = backColor;
      this.isSelected = false;
    }

    function addSquares() {
      for (let i = 0; i < shapeAmount; i++) {
        let square = new Square(x, y);
        x += w;
        if (x == W) {
          y += h;
          x = 0;
        }
        squares.push(square);
      }
      drawSquares();
    }

    function drawSquares() {
      $.clearRect(0, 0, W, H);

      for (let i = 0; i < squares.length; i++) {
        let square = squares[i];
        $.beginPath();
        $.rect(square.x, square.y, w, h);
        $.fillStyle = square.color;
        $.lineWidth = border;
        $.strokeStyle = borderColor;
        $.fill();
        $.stroke();
      }
    }

    c.addEventListener("mousemove", isMouseMove);

    document.addEventListener("mousemove", (e) => {
      if (e.toElement.localName !== "canvas") draw = false;
    });

    c.onclick = select;
    function isMouseMove(e) {
      if (draw) {
        select(e);
      }
    }

    function select(e) {
      let clickX = e.pageX - c.offsetLeft,
        clickY = e.pageY - c.offsetTop;

      for (let i = 0; i < squares.length; i++) {
        let square = squares[i];

        if (
          clickX > square.x &&
          clickX < square.x + w &&
          clickY > square.y &&
          clickY < square.y + h
        ) {
          square.isSelected = true;
          square.color = colorFill;
          drawSquares();
        }
      }
    }

    document.querySelector(".get").onclick = () => {
      let data = squares.map((item) => Boolean(item.isSelected));
      console.log(data);
    };

    document.querySelector(".send").onclick = async () => {
      let data = squares.map((item) => Boolean(item.isSelected));
      console.log(data);

      let response = await fetch("url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(data),
      });

      let result = await response.json();
      alert(result.message);
    };
  }
}

generateCanvas();
