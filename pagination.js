'use strict';

alert("hiiiiiiiii");

var numofitem=$('#loop .list-group').length;
var pagelimit=5;
$("#loop .list-group:gt(" + (pagelimit-1) + ")").hide();
var numofpages=Math.round(numofitem/pagelimit);
$(".pagination").append("<li class='current-page active' ><a href='javascript:void(0)'>" + 1 + "</a></li>");

for(var i=2;i<=numofpages;i++)
{
	$(".pagination").append("<li class='current-page'><a href='javascript:void(0)'> " + i + "</a></li>");
}

$(".pagination").append("<li id='next-page' ><a href='javascript:void(0)' aria-label='next'><span aria-hidden='true'>&raquo; </span></a></li>");

$(".pagination li.current-page").on("click",function(){
    if($(this).hasClass('active')){
    	return false;
    }	
    else{
    	var cp=$(this).index();
    	$('.pagination li').removeClass("active");
    	$(this).addClass("active");
    	$("#loop .list-group").hide();

    	var grandtotal=pagelimit * cp;

    	for(var i=grandtotal-pagelimit; i < grandtotal; i++)
    	{
    		$("#loop .list-group:eq(" +  i + ")").show();
    	}
    }
});

$("#next-page").on("click" , function(){
	var currentpage=$(".pagination li.active").index();
	if(currentpage===numofpages){
		return false;
	}
	else
	{
		currentpage++;
		$('.pagination li').removeClass("active");
    	$("#loop .list-group").hide();

    	var grandtotal=pagelimit * currentpage;
    	for(var i=grandtotal-pagelimit; i < grandtotal; i++)
    	{
    		$("#loop .list-group:eq(" + i + ")").show();
    	}
    	$(".pagination li.current-page:eq(" + (currentpage-1) + ")").addClass('active');
	}
});


$("#previous-page").on("click" , function(){
	var currentpage=$(".pagination li.active").index();
	if(currentpage===1){
		return false;
	}
	else
	{
		currentpage--;
		$('.pagination li').removeClass("active");
    	$("#loop .list-group").hide();

    	var grandtotal=pagelimit * currentpage;
    	for(var i=grandtotal-pagelimit; i < grandtotal; i++)
    	{
    		$("#loop .list-group:eq(" + i + ")").show();
    	}
    	$(".pagination li.current-page:eq(" + (currentpage-1) + ")").addClass('active');
	}
});



