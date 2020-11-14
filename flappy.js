// buat variable dengan nama cvs yang mengacu pada element dengan id #canvas di html
// https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById
var cvs = document.getElementById("canvas");

// buat variable dengan nama ctx untuk memberi konteks 2D pada canvas melalui variable cvs yang telah dibuat, kalau cek melalui MDN, contoh penulisannya adalah canvas.getContext(contextType);
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
// gunakan konteks ("2d")
var ctx = cvs.getContext("2d");

// tempatkan gambar yang telah disediakan di folder images
var bird = new Image();
var bg = new Image();
var fg = new Image();
var pipeNorth = new Image();
var pipeSouth = new Image();
// gunakan metode .src pada objek image untuk mengambil sumber gambar sesuai namanya
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image
bird.src = "images/bird.png";
bg.src = "images/bg.png";
fg.src = "images/fg.png";
pipeNorth.src = "images/pipeNorth.png";
pipeSouth.src = "images/pipeSouth.png";

// untuk membuat konfigurasi, kamu akan membutuhkan beberapa variable untuk pengaturan
// variable gap untuk mengatur celah di antara pipa
var gap = 85;
// variable constant
var constant;
// variable bX untuk jarak ke tepi layar
var bX = 10;
// variable bY untuk tinggi terbang awal
var bY = 150;
// variable gravity untuk mengatur kecepatan turunnya
var gravity = 1.5;
// variable score dengan nilai default 0
var score = 0;

// beri suara sesuai dengan yang telah disediakan di folder sounds
var fly = new Audio();
var scor = new Audio();
// gunakan metode .src pada objek audio untuk mengambil sumber suara sesuai namanya
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Audio
fly.src = "sounds/fly.mp3";
scor.src = "sounds/score.mp3";

// buat fungsi moveUp yang trigger setiap kali ada tombol yang ditekan, maka karakter akan naik
// naikkan tinggi terbang, misal 30, dan uji codemu
// kita akan menggunakan event on key down
// https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event
function moveUp(){
    bY -= 25;
    fly.play();
}
document.addEventListener("keydown",moveUp);

// atur pipe coordinates
// buat variable pipe dengan tipe data array
// assign nilai pertamanya sebagai objek dengan x sesuai lebar canvas dengan menggunakan properti width, dan y yang bernilai 0
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/width
var pipe = [];
pipe[0] = {
    x : cvs.width,
    y : 0
};

// gunakan function draw untuk menjalankan permainan
// dengan menggunakan konteks yang telah dibuat(ctx), kita akan menggambarkan kanvasnya dengan drawImage, di mana koordinatnya 0,0 dan background dengan gambar yang telah disediakan
// e.g
function draw(){
    ctx.drawImage(bg,0,0);
    for(var i = 0; i < pipe.length; i++){
        // gambar pipeSouth pada kanvas dengan dimulai dari titik ordinat (x, y)
        // e.g
        ctx.drawImage(pipeNorth,pipe[i].x,pipe[i].y);
        // gunakan variable constant untuk mengambil tinggi pipeNorth ditambah gap
        // gambar pipeSouth pada kanvas dengan dimulai dari titik ordinat (x, y+contant)
        constant = pipeNorth.height+gap;
        ctx.drawImage(pipeSouth,pipe[i].x,pipe[i].y+constant);

        // pada setiap kali animasi, e.g
        pipe[i].x--;
        // jika pipa mendekati aksis(x) 100,
        // maka push pipe baru dengan x di ujung canvas menggunakan acuan lebar kanvas
        // dan y menggunakan pembulatan angka random (0sampai1) dikalikan tinggi pipeNorth yang kemudian dikurangi tinggi pipeNorth
        // posisi y menentukan posisi awal pipeNorth
        if( pipe[i].x == 125 ){
            pipe.push({
                x : cvs.width,
                y : Math.floor(Math.random()*pipeNorth.height)-pipeNorth.height
            });
        }

        // JIKA
        // 
        // tabrak pipa
        // bX ditambah lebar karakter lebih besar atau sama dengan aksis pipe &&
        // 
        // bX lebih kecil atau sama dengan aksis pipe ditambah dengan lebar northPipe &&
        // tabrak atas bawah
        // bY lebih kecil atau sama dengan ordinat pipe ditambah dengan tinggi northPipe || bY lebih besar atau sama dengan ordinat pipe ditambah nilai constant yang dibuat
        // 
        // tabrak tanah
        // atau kondisi terakhir, ordinat karakter ditambah tinggi karakter lebih besar daripada tinggi canvas dikurangi tinggi fg
        if( bX + bird.width >= pipe[i].x && bX <= pipe[i].x + pipeNorth.width && (bY <= pipe[i].y + pipeNorth.height || bY+bird.height >= pipe[i].y+constant) || bY + bird.height >=  cvs.height - fg.height){
            // apabila salah satu kondisi di atas tercapai, brarti game harus direload
            // location.reload(); // reload the page
        }

        // jika aksis dari pipe mencapai nilai 5, maka skor bertambah
        if(pipe[i].x == 5){
            score++;
            scor.play();
        }
    }
    // gambar ground di kanvas dengan menggunakan gambar fg yang telah disediakan, dengan koordinat (0, mulai dari tinggi kanvas dikurangi tinggi fg), ingat perhitungan drawImage adalah dari kiri atas
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/height
    // gambar objek karakter dengan menggunakan file bird yang telah disediakan dengan posisi awal menggunakan koordinat (bX, bY)
    ctx.drawImage(fg,0,cvs.height - fg.height);
    ctx.drawImage(bird,bX,bY);
    // pada setiap animasi, posisi ordinat bertambah sesuai gravity
    // bY += gravity;

    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle
    ctx.fillStyle = "#000";
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font
    ctx.font = "20px Verdana";
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillText
    ctx.fillText("Score : "+score,10,cvs.height-20);
    requestAnimationFrame(draw);
}

draw();
