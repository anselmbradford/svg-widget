/* Application functionality */

var main = (function () {
"use strict";
	var main = {};

	// initalize the application
	main.init = function()
	{
		svgOpeningHours.init(); // initialize data load
	}

	// mock data for times
	var mockHours = 
	{   "today" : "Wed Apr 17 2013 11:13:48 GMT-0700 (PDT)",
	    "hours" : 
	     
	    { "monday": 
	        [
	            { "start": "0900", "finish": "1200" },
	            { "start": "1300", "finish": "1700" }
	        ]
	    ,
	     "tuesday":
	        [
	            { "start": "0900", "finish": "1200" },
	            { "start": "1300", "finish": "1700" }
	        ]
	    ,
	     "wednesday":
	        [
	            { "start": "1100", "finish": "1200" },
	            { "start": "1300", "finish": "1700" }
	        ]
	    ,
	     "thursday":
	        [
	            { "start": "0900", "finish": "1200" },
	            { "start": "1300", "finish": "1700" }
	        ]
	    ,
	     "friday":
	        [
	            { "start": "0900", "finish": "1200" },
	            { "start": "1300", "finish": "1700" }
	        ]
	    ,
	     "saturday":
	        []
	    ,
	     "sunday":
	        []
	    }
	};

	//=================================================================================
	// SVG opening hours widget

	var svgOpeningHours = (function () {

		// internally scoped object
		var svgOpeningHours = {};

		// PRIVATE PROPERTIES
		var svg; // SVG reference to element on webpage
		var horizontalGap = 18; // horizontal gap
		var verticalGap = 10; // vertical gap


		// PUBLIC METHODS
		// initalize the application
		svgOpeningHours.init = function()
		{
			svg = document.querySelector(".opening-times");
			svg.addEventListener("load", svgLoaded, false);
		}

		// PRIVATE METHODS
		function svgLoaded()
		{
		    var i; // index for iterators

		    // arrays for text elements
		    var ampms = [];
		    var hours = [];
		    var days = [];

		    // max height of text elements
		    var ampmMaxHeight = 0;
		    var hoursMaxHeight = 0;
		    var daysMaxHeight = 0;

		    // max width of text elements
		    var daysMaxWidth = 0;
		    var hoursMaxWidth = horizontalGap*24;

		    var hoursGroup = svg.appendChild(makeSVG('g',{class:'hours'})); // group of hrs
		    var ampmsGroup = svg.appendChild(makeSVG('g',{class:'ampms'})); // am/pm group

		    var daysGroup = svg.appendChild(makeSVG('g',{class:'days'})); // group of days
		        var mondayGroup = daysGroup.appendChild(makeSVG('g',{class:'day'}));
		        var tuesdayGroup = daysGroup.appendChild(makeSVG('g',{class:'day'}));
		        var wednesdayGroup = daysGroup.appendChild(makeSVG('g',{class:'day'}));
		        var thursdayGroup = daysGroup.appendChild(makeSVG('g',{class:'day'}));
		        var fridayGroup = daysGroup.appendChild(makeSVG('g',{class:'day'}));
		        var saturdayGroup = daysGroup.appendChild(makeSVG('g',{class:'day'}));
		        var sundayGroup = daysGroup.appendChild(makeSVG('g',{class:'day'}));

		    //arrange days
		    for (i=0; i<7; i++)
		    {
		        var openGroup;
		        var dayText = '';
		        switch(i)
		        {
		            case 0 : dayText='Monday'; openGroup = mondayGroup; break;
		            case 1 : dayText='Tuesday'; openGroup = tuesdayGroup; break;
		            case 2 : dayText='Wednesday'; openGroup = wednesdayGroup; break;
		            case 3 : dayText='Thursday'; openGroup = thursdayGroup; break;
		            case 4 : dayText='Friday'; openGroup = fridayGroup; break;
		            case 5 : dayText='Saturday'; openGroup = saturdayGroup; break;
		            case 6 : dayText='Sunday'; openGroup = sundayGroup; break;
		        }

		        var day = openGroup.appendChild(makeSVG('text', {x:0, y:0, class:'monday'}));
		        day.textContent = dayText;

		        daysMaxHeight = Math.max(day.offsetHeight, daysMaxHeight);
		        daysMaxWidth = Math.max(day.offsetWidth, daysMaxWidth);
		        days.push(day);
		    }

		    // create hours
		    var startHour = 5; // hour to start on (0-24)
		    var currHour = 0;
		    var isAM = true; // whether currently iterating hour is AM or PM
		    var lastIsAM = false; // used to only generate AM/PM when needed
		    var ampmSpan = 0;
		    for (i=0; i < 24; i++)
		    {
		        // convert 24 hour to 12 hour notation
		        currHour = startHour+i;
		        if (currHour > 24) currHour -= 24;
		        if (currHour >= 12 && currHour < 24) isAM = false;
		            else isAM = true;
		        if (currHour > 12) currHour -= 12;
		        if (currHour == 0) currHour = 12;

		        // create AM/PM
		        if (lastIsAM != isAM)
		        {
		            var ampm = ampmsGroup.appendChild(makeSVG('text', {x:0, y:0, class:'ampm'}));
		            if (isAM) ampm.textContent = "AM";
		            else ampm.textContent = "PM";
		            ampmMaxHeight = Math.max(ampm.offsetHeight,ampmMaxHeight);
		            if (ampms.length != 0) 
		            {
		                ampms[ampms.length-1]["span"] = ampmSpan;
		                ampmSpan = 0;
		            }
		            ampms.push({'span':'', 'ampm':ampm});
		        }
		        lastIsAM = isAM;

		        var hour = hoursGroup.appendChild(makeSVG('text', {x:0, y:0, class:'hour'}));
		        hour.textContent = currHour;
		        hoursMaxHeight = Math.max(hour.offsetHeight,hoursMaxHeight);
		        hours.push(hour);

		        ampmSpan++;

		        if ( i == 23 )
		        {
		            ampms[ampms.length-1]["span"] = ampmSpan;
		        }
		    }

		    // layout days
		    for (i in days)
		    {
		        days[i].setAttribute("x" , (daysMaxWidth-days[i].offsetWidth) );

		        days[i].setAttribute("y" , ((verticalGap*2)+ampmMaxHeight+hoursMaxHeight)+((daysMaxHeight+verticalGap)*i) );
		    }

		    // layout times
		    for (i in hours)
		    {
		        var hour = hours[i];
		        var xOffset = daysMaxWidth+(horizontalGap*i)+horizontalGap;
		        var yOffset = ampmMaxHeight;
		        hour.setAttribute("y",ampmMaxHeight+verticalGap);
		        
		        // create separators
		        hoursGroup.appendChild(makeSVG('line', {x1:xOffset, y1:yOffset, x2:xOffset, y2:yOffset+hoursMaxHeight, class: 'separator'}));

		        // center text in separators
		        hour.setAttribute("x", xOffset + (((xOffset+horizontalGap)-xOffset)/2) - (hour.offsetWidth/2) );
		    }
		        // create final separator
		        svg.appendChild(makeSVG('line', {x1:xOffset+horizontalGap, y1:yOffset, x2:xOffset+horizontalGap, y2:yOffset+hoursMaxHeight, class: 'separator'}))


		    // layout am/pm
		    var xOffset = daysMaxWidth+horizontalGap;
		    var yOffset = ampmMaxHeight+verticalGap;    
		    for (i in ampms)
		    {
		        var currAmpm = ampms[i];
		         // create am/pm bar
		        var bar = hoursGroup.appendChild(makeSVG('rect', {x:xOffset,y:0,width:(horizontalGap*currAmpm['span']),height:ampmMaxHeight}));
		        
		        // if am or pm apply different css class
		        if (currAmpm.ampm.textContent == 'AM') bar.setAttribute('class' , 'ampm-am');
		        else bar.setAttribute('class' , 'ampm-pm');
		        xOffset += (horizontalGap*currAmpm['span']);

		        currAmpm.ampm.setAttribute('y' , 10);
		        currAmpm.ampm.setAttribute('x' , xOffset-(((horizontalGap*currAmpm['span'])/2)+currAmpm.ampm.offsetWidth/2));
		    }

		    // create timelines
		    var minute = hoursMaxWidth/(24*60); // the width of a minute on the diagram
		    
		    var today = new Date(/*mockHours["today"]*/);
		    var weekDay = today.getDay();
		    var time = (((today.getHours()*60)+today.getMinutes())-(startHour*60))*minute;
		    
		    for (i in days)
		    {
		        yOffset = ((verticalGap*2)+ampmMaxHeight+hoursMaxHeight)+((daysMaxHeight+verticalGap)*i);

		        var dayName;
		        var openGroup;
		        switch(i)
		        {
		            case '0' : dayName='monday';openGroup = mondayGroup; break;
		            case '1' : dayName='tuesday';openGroup = tuesdayGroup; break;
		            case '2' : dayName='wednesday';openGroup = wednesdayGroup; break;
		            case '3' : dayName='thursday';openGroup = thursdayGroup; break;
		            case '4' : dayName='friday';openGroup = fridayGroup; break;
		            case '5' : dayName='saturday';openGroup = saturdayGroup; break;
		            case '6' : dayName='sunday';openGroup = sundayGroup; break;
		        }

		        yOffset = ((verticalGap*2)+ampmMaxHeight+hoursMaxHeight)+((daysMaxHeight+verticalGap)*i);

		        var timeline = openGroup.appendChild(makeSVG('line', {x1:daysMaxWidth+horizontalGap,y1:yOffset-(hoursMaxHeight/2),x2:(daysMaxWidth+hoursMaxWidth+horizontalGap),y2:yOffset-(hoursMaxHeight/2),class: 'timeline'}));
		        
		        if (weekDay-1 == i)
		        {
		            timeline.setAttribute('class','timeline-today');
		        }

		        // create time blocks
		        var timeblocks = mockHours["hours"][dayName];   
		        var minutes = 0;
		        var startTime = 0;
		        var finishTime = 0; 
		        for (var t in timeblocks)
		        {
		            startTime = (Number(timeblocks[t]['start'])/100)*60;
		            finishTime = (Number(timeblocks[t]['finish'])/100)*60;
		            minutes = (finishTime-startTime);
		            startTime -= (startHour*60);

		            openGroup.appendChild(makeSVG('rect',{x:daysMaxWidth+horizontalGap+startTime*minute,y:yOffset-hoursMaxHeight,width:minutes*minute,height:hoursMaxHeight,class:'time-block'}));
		        }

		        // draw overlays
		        var overlay = openGroup.appendChild(makeSVG('rect', {x:0,y:yOffset-hoursMaxHeight-(verticalGap/2),width:daysMaxWidth+horizontalGap+hoursMaxWidth,height:hoursMaxHeight+verticalGap,class: 'overlay'}));

		        if (weekDay-1 == i)
		        {
		            overlay.setAttribute('class','overlay-hidden');
		        }

		        // create time marker
		        var yOffset = ampmMaxHeight+hoursMaxHeight;
		        svg.appendChild(makeSVG('line',{x1:daysMaxWidth+horizontalGap+time,y1:yOffset,x2:daysMaxWidth+horizontalGap+time,y2:yOffset+(daysMaxHeight+verticalGap)*7, class:'time-marker'}));
			}
		}

		function makeSVG(tag, attrs) {
		    var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
		    for (var k in attrs)
		        el.setAttribute(k, attrs[k]);
		    return el;
		}

		return svgOpeningHours;

	})();

// return internally scoped var as value of globally scoped object
return main;

})();