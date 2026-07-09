let users = JSON.parse(localStorage.getItem("users")) || [];


// حفظ البيانات

function saveUsers(){

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

}



// إنشاء حساب طالب

function register(){

    let name = document.querySelector(".name").value;

    let username = document.querySelector(".username").value;

    let password = document.querySelector(".password").value;

    let phone = document.querySelector(".phone").value;



    if(!name || !username || !password){

        alert("املأ البيانات المطلوبة");

        return;

    }



    let checkUser = users.find(
        user => user.username === username
    );


    if(checkUser){

        alert("اسم المستخدم موجود بالفعل");

        return;

    }



    let student = {


        name:name,

        username:username,

        password:password,

        phone:phone,


        role:"student",


        points:0,


        attendance:0,


        tasks:0,


        absence:0,


        warnings:0,


        stars:0,


        gifts:[]


    };



    users.push(student);



    saveUsers();



    alert("تم إنشاء الحساب بنجاح");


    window.location.href="login.html";

}





// تسجيل الدخول

function login(){


    let username = 
    document.querySelector(".login-username").value;


    let password =
    document.querySelector(".login-password").value;



    let user = users.find(

        u =>

        u.username === username &&

        u.password === password

    );



    if(user){



        localStorage.setItem(

            "currentUser",

            JSON.stringify(user)

        );



        if(user.role === "student"){


            window.location.href="student.html";


        }

        else{


            window.location.href="admin.html";


        }



    }

    else{


        alert("بيانات الدخول غير صحيحة");


    }



}







// عرض بيانات الطالب

if(location.pathname.includes("student.html")){


    let currentUser = JSON.parse(

        localStorage.getItem("currentUser")

    );



    if(currentUser){



        document.getElementById("studentName").innerHTML =

        "👋 أهلاً " + currentUser.name;



        document.getElementById("studentPoints").innerHTML =

        currentUser.points;



        document.getElementById("studentAttendance").innerHTML =

        currentUser.attendance;



        document.getElementById("studentTasks").innerHTML =

        currentUser.tasks;



        document.getElementById("studentAbsence").innerHTML =

        currentUser.absence;



        document.getElementById("studentWarnings").innerHTML =

        currentUser.warnings + " / 3";



        if(document.getElementById("studentStars")){


            document.getElementById("studentStars").innerHTML =

            currentUser.stars;


        }


    }


}
// إدارة الطلاب

if(location.pathname.includes("manage_students.html")){


let list = document.getElementById("studentsList");



function showStudents(search=""){


list.innerHTML = "";



let students = users.filter(user =>

user.role === "student" &&

user.name.includes(search)

);



students.forEach(student=>{



let card = document.createElement("div");


card.className = "card";



card.innerHTML = `


<h3>
${student.name}
</h3>


<p>
👤 ${student.username}
</p>


<p>
⭐ النقاط: ${student.points}
</p>


<p>
🟢 الحضور: ${student.attendance}
</p>


<p>
📌 التاسكات: ${student.tasks}
</p>


<p>
⭐ Stars: ${student.stars}
</p>


<p>
🔴 الغياب: ${student.absence}
</p>


<p>
⚠️ الإنذارات: ${student.warnings}/3
</p>



<button onclick="attendance('${student.username}')">

🟢 حضور +10

</button>



<button onclick="task('${student.username}')">

📌 تاسك +5

</button>



<button onclick="addStar('${student.username}')">

⭐ Star +10

</button>



<button onclick="absence('${student.username}')">

🔴 غياب -7

</button>



<button onclick="warning('${student.username}')">

⚠️ إنذار

</button>



<button onclick="deleteStudent('${student.username}')">

🗑️ حذف

</button>



`;



list.appendChild(card);



});


}



showStudents();




if(document.getElementById("searchStudent")){


document.getElementById("searchStudent")

.addEventListener("input",function(){


showStudents(this.value);


});


}


}






// البحث عن طالب

function findUser(username){


return users.find(

user => user.username === username

);


}





// الحضور +10

function attendance(username){


let user = findUser(username);


user.points += 10;


user.attendance++;



saveUsers();


location.reload();


}






// التاسك +5

function task(username){


let user = findUser(username);


user.points += 5;


user.tasks++;



saveUsers();


location.reload();


}






// Star +10

function addStar(username){


let user = findUser(username);



user.points += 10;


user.stars++;



saveUsers();


alert("تم إضافة ⭐ Star +10");


location.reload();


}







// الغياب -7

function absence(username){


let user = findUser(username);



user.points -= 7;



if(user.points < 0){

user.points = 0;

}



user.absence++;



saveUsers();


location.reload();


}







// الإنذار

function warning(username){


let user = findUser(username);



user.warnings++;



user.points = 0;



if(user.warnings >= 3){


alert("تم حذف الطالب بسبب 3 إنذارات");


deleteStudent(username);


return;


}



saveUsers();


location.reload();


}







// حذف الطالب

function deleteStudent(username){



users = users.filter(

user => user.username !== username

);



saveUsers();


location.reload();


}
// شراء الهدايا

function buyGift(price, giftName){


let currentUser = JSON.parse(

localStorage.getItem("currentUser")

);



if(!currentUser){

alert("يجب تسجيل الدخول");

return;

}




if(currentUser.points < price){


alert("النقاط غير كافية ⭐");


return;


}




currentUser.points -= price;



if(!currentUser.gifts){


currentUser.gifts = [];


}



currentUser.gifts.push({

name:giftName,

date:new Date().toLocaleDateString()

});





users = users.map(user =>


user.username === currentUser.username

? currentUser

: user


);




localStorage.setItem(

"users",

JSON.stringify(users)

);



localStorage.setItem(

"currentUser",

JSON.stringify(currentUser)

);




alert("تم شراء الهدية 🎁");



location.reload();



}







// عرض هدايا الطالب

if(location.pathname.includes("my_gifts.html")){


let user = JSON.parse(

localStorage.getItem("currentUser")

);



let list = document.getElementById("giftsList");



if(user && user.gifts.length > 0){



user.gifts.forEach(gift=>{


let card=document.createElement("div");


card.className="card";



card.innerHTML=`


<h3>
🎁 ${gift.name}
</h3>


<p>
📅 ${gift.date}
</p>


`;



list.appendChild(card);



});


}

else{


list.innerHTML =
"<p>لا توجد هدايا</p>";

}


}






// ترتيب الطلاب حسب النقاط

if(location.pathname.includes("ranking.html")){


let list = document.getElementById("rankingList");



let students = users

.filter(user=>user.role==="student")

.sort((a,b)=>b.points-a.points);




students.forEach((student,index)=>{


let card=document.createElement("div");


card.className="card";



let medal="";


if(index===0){

medal="🥇";

}

else if(index===1){

medal="🥈";

}

else if(index===2){

medal="🥉";

}





card.innerHTML=`


<h3>
${medal} المركز ${index+1}
</h3>


<p>
👤 ${student.name}
</p>


<p>
⭐ النقاط: ${student.points}
</p>


`;



list.appendChild(card);



});


}






// تسجيل الخروج

function logout(){


localStorage.removeItem("currentUser");


window.location.href="login.html";


}