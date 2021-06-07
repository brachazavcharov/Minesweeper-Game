
var mat = [];
var NUM_BOM;
var countFlaggedBom = 0;
var cubes;
var level = 1;
//function SaveData() {
//    var lev = level.value;
//    localStorage.setItem("level", lev);
//    window.location = "HtmlPage2.html";
//}
function getLevel() {
    level = parseInt(localStorage.getItem("level"));
    switch (level) {
        case 1:
            NUM_BOM = 10;
            cubes = 10;
            break;
        case 2:
            NUM_BOM = 20;
            cubes = 15;
            break;
        case 3:
            NUM_BOM = 30;
            cubes = 20;
            break;
    }
}
function main() {
    getLevel();
    createTable();
    Start();
}
main();
function createTable() {

    var i, j;
    for (i = 0; i < cubes; i++) {
        var trp = document.createElement("tr");
        document.getElementById("game").appendChild(trp);
        for (j = 0; j < cubes; j++) {
            const row = i;
            const col = j;
            var td = document.createElement("td");
            td.id = i + '_' + j;
            td.onclick = function (e) { presentNumberCell(e, row, col) };
            trp.appendChild(td);
            td.oncontextmenu = flagBom;
            td.style.width = 33.33 / cubes + 'vh';
            td.style.height = 33.33 / cubes + 'vh';
        }
        document.getElementById("game").appendChild(trp);
    }
}
function Start() {
    for (var i = 0; i < cubes; i++) {
        mat[i] = [];
        for (var j = 0; j < cubes; j++) {
            mat[i][j] = 0;
        }
    }
    RandomBom();
    InsertNumberBom();
}
function RandomBom() {
    //מגרילה 10 מוקשים בתוך המצריצה
    //צריכה להגריל כל פעם גם i וגם j
    //ולבדוק אם אין שם כבר פצצה
    var numberI = Math.round(Math.random() * 100) % cubes;
    var numberJ = Math.round(Math.random() * 100) % cubes;
    var countBom = 0;
    while (countBom < NUM_BOM) {
        if (mat[numberI][numberJ] != -1)
            countBom++;
        mat[numberI][numberJ] = -1;
        var numberI = Math.round(Math.random() * 100) % cubes;
        var numberJ = Math.round(Math.random() * 100) % cubes;
    }
}
function countBom(iPlace, jPlace) {
    //בדקנו במטריציה קטנה.. את  כמות הפצצות שסובבות את המקום שנישלח אלינו מהפונקציה החיצונית
    var count = 0;
    var startI = iPlace - 1, endI = iPlace + 1;
    var startJ = jPlace - 1, endJ = jPlace + 1;
    if (startI < 0)
        startI = 0;
    if (startJ < 0)
        startJ = 0;
    if (endI > cubes - 1)
        endI = cubes - 1;
    if (endJ > cubes - 1)
        endJ = cubes - 1;
    for (var i = startI; i <= endI; i++) {
        for (var j = startJ; j <= endJ; j++) {
            if (mat[i][j] == -1)
                count++;
        }
    }
    return count;
}
function InsertNumberBom() {
    //מעבר על כל המסביב ובדיקה כמה פצצות קיימות
    //במידה וקים מכניסה לתוך המיקום במערך את מספר הפצצות שמצאה
    for (var i = 0; i < cubes; i++) {
        for (var j = 0; j < cubes; j++) {
            if (mat[i][j] != -1)
                mat[i][j] = countBom(i, j);
        }
    }
}
function presentNumberCell(e, i, j) {
    //בעת לחיצת עכבר על אחד התאים 
    //יוצג תוכן התא
    console.log(e.target);
    console.log(i);
    console.log(j);
    var num = mat[i][j];
    var td = e.target;
    if (num == -1) {
        td.style.backgroundImage = "url('pictures/big_boom.png')";
        td.style.backgroundSize = "cover";

        setTimeout(function () { window.location = 'lost.html'; }, 500);
    }
    else {
        if (num != 0)
            td.innerHTML = num;
        else
            revealZeros(i, j);
    }
}

function revealZeros(x, y) {
    //בעת לחיצת עכבר על אחד התאים 
    //במקרה שהוא לא פצצה
    //יוצגו תוכן כל התאים התואמים בתוכנם לתוכן התא הלחוץ
    if (x < 0 || x > cubes - 1 || y < 0 || y > cubes - 1) return; // check for bounds

    var td = document.getElementById(x + '_' + y);
    if (mat[x][y] == 0 && td.innerText != "0") {
        td.innerHTML = 0;
        //עדכון תצוגה
        revealZeros(x + 1, y);
        revealZeros(x - 1, y);
        revealZeros(x, y - 1);
        revealZeros(x, y + 1);
    } else {
        return;
    }
}
function flagBom(event) {
    event.preventDefault();
    //בעת לחיצה על הקליק השמאלי יצבע התא באדום כאות  אזהרה    
    var td = event.target;
    if (td.style.backgroundImage == 'url("pictures/סמל-מוקש.png")') {
        td.style.backgroundImage = "";
        countFlaggedBom--;
        return;
    }
    td.style.backgroundImage = 'url("pictures/סמל-מוקש.png")';
    td.style.backgroundSize = "cover";
    countFlaggedBom++;
    //בעת לחיצה על קליק ימני במקרה שהדגל מופיע כבר אז שהדגל יעלם
    //if (td.style.backgroundImage = "url('Universal Signs 027.jpg')"){
    //    td.style.backgroundImage = "";
    ////    countFlaggedBom++;
    //}
    //אם ישנם תאים אדומים כמספר הפצצות יבדוק אם באמת בכל תא אדום יש פצצה
    if (countFlaggedBom == NUM_BOM) {
        var success = checkFlaggedBom();
        //אם כן ינצח אם לא יתן למשתמש אפשרות ללחוץ שוב על התאים האדומים ולהחזירם ללבנים
        if (success == true) {
            setTimeout(function () {
                window.location = 'win.html';
            }, 500);
            showAllBoms();

        }
        else {
            //קריאה לפונקציה שמראה את המיקומים הנכונים של הפצצות.1.
            //.2
            setTimeout(function () {
                window.location = 'lost.html';
            }, 500);
            showAllBoms();
        }
    }
}
function checkFlaggedBom() {
    //ובודקת אם כל תא הצבוע בצבע הוא באמת פצצה 
    // אם המשתמש צדק יחזיר אמת או שקר
    var countRight = 0;
    for (var i = 0; i < cubes; i++) {
        for (var j = 0; j < cubes; j++) {
            if (mat[i][j] == -1) {
                var td = document.getElementById(i + '_' + j);
                if (td.style.backgroundImage == 'url("pictures/סמל-מוקש.png")')
                    countRight++;
            }
        }
    }
    if (countRight == NUM_BOM)
        return true;
    return false;
}
function showAllBoms() {
    //פונקציה שתציג את המיקומים הנכונים של הפצצות
    for (var i = 0; i < cubes; i++) {
        for (var j = 0; j < cubes; j++) {
            if (mat[i][j] == -1) {
                var td = document.getElementById(i + '_' + j);
                td.style.backgroundImage = "url('pictures/big_boom.png')";
                td.style.backgroundSize = "cover";
            }
        }
    }
}
//function() {
//    //-זמן
//    //פונקציה ששומרת לי את הזמן הנמוך ביותר בכל המשחקים ששוחקו עד עכשיו
//    //ואם ניצח מציג לו את ה"שיא" שלו
//}


