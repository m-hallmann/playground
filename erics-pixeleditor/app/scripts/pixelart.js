/**
 * Created by eric.kretzschmar on 07.05.17.
 */

$(".alert1").hide();
$(".alert2").hide();

$(".pixel > div").on("click",function(){
  var val;
  switch ($('input[name=color]:checked').val()) {
    case 'b':
      val = 'b';
      break;
    case 'r':
      val = 'r';
      break;
    case 'g':
      val = 'g';
      break;
    case 'bl':
      val = 'bl';
      break;
    case 'w':
      val = 'w';
      break;
    case 'gr':
      val = 'gr';
      break;
    case 'ay':
      val = 'ay';
      break;
    default:
      val = 'bl';
      break;
  }

  $(this).removeClass();
  $(this).addClass("colors-"+val);

  //console.log(curColor($(this).css("background-color")));
});
//the good one
$(".btn--export").on("click",function(){
  var s ="";
  $(".canvas--small .pixel > div").each(function( index ) {
    var color= $(this).css("background-color").toString();
    if( color === "rgba(0, 0, 0, 0)" || color === "rgb(255, 255, 255)")
    {
      s+=0;
    }
    else
    {
      s+=1;
    }
  });
  console.log(s);
});

// pixel definierter größe hinzufügen
$("realCanvas").on('load',function(){

});

//for community meeting
$(".pixel > input[name=pixel]").on("click",function() {
    if ($(this).hasClass("colors-bl")) {
      $(this).removeClass();
      //console.log($(this).is(':checked'));
    }
    else
    {
      $(this).addClass("colors-bl");
      //console.log($(this).is(':checked'));
    }
  });

$(".btn--exportt").on("click",function(){
  var s ="";
  $(".canvas--small .pixel > input[name=pixel]").each(function( index ) {
    var color= $(this).css("background-color").toString();
    if( color === "rgba(0, 0, 0, 0)" || color === "rgb(255, 255, 255)")
    {
      s+=0;
    }
    else
    {
      s+=1;
    }
  });
  console.log(s);
});

//input
$(".import--btn").on("click",function(){
  var s =$(".import--txt").val();
  console.log(s);
  //console.log((/n[2-9A-Za-z]/i).test(s));
  //console.log((/[2-9]/i).test(s));

  if(!$.isNumeric(s) || (/[2-9]/i).test(s))
  {
    $(".alert1").show();
    setTimeout(function() {
      $(".alert1").fadeOut("slow");
    }, 3000); // <-- time in milliseconds
   return;
  }

  if(s.length>0 && s.length<=25)
  {
    $(".canvas--small .pixel > input[name=pixel]").each(function( index ) {
      console.log(typeof (s[index]));
      if(s[index]==="1")
      {
        $(this).addClass("colors-bl");
      }
      else
      {
        //do nothing
      }
    });
  }
  else{
    $(".alert2").show();
    setTimeout(function() {
      $(".alert2").fadeOut("slow");
    }, 3000); // <-- time in milliseconds
  }

  /*$(".canvas--small .pixel > input[name=pixel]").each(function( index ) {
   var color= $(this).css("background-color").toString();
   if( color === "rgba(0, 0, 0, 0)" || color === "rgb(255, 255, 255)")
   {
   s+=0;
   }
   else
   {
   s+=1;
   }
   });*/
});

