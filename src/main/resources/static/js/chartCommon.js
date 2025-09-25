/**
 * cloud 차트 
 * data 형식 
 * var words = [
		  {text: "아이봇", weight: 123},
		  {text: "코나", weight: 102},
		  {text: "토끼와 거북이", weight: 53},
		  {text: "말건네기", weight: 32},
		  {text: "인사", weight: 22},
		  {text: "저축예금", weight: 17},
		  {text: "게임", weight: 16},
		  {text: "학원", weight: 15},
		  {text: "TEST", weight: 15},
		  {text: "금융꿀팁", weight: 3},
		  {text: "전세대출", weight: 2},
		  {text: "금지단어분석", weight: 1}
		];
 * */
var cloudChart = function(data, divId){
	
	$('#'+divId).jQCloud('destroy');
	$('#'+divId).jQCloud(data, {
		  height: 310,
		  autoResize: true
		});
}

/**
 * 파이 차트
 * 테이더 타입 
 *  var pieData = {
			  정답: 500,
			  오답: 200,
			  추천: 666
			}; 
 * */
var donutChart = function(jsonData,title,divId){
	c3.generate({
		bindto: "#"+divId,
	  	data: {
		    json: [jsonData],
		    keys: {
		    	value: Object.keys(jsonData),
		    },
		    type: "donut"
		                     
	  	},
	  	donut: {
	    	title: title,
	  }	,
	  //데이터 보여주는 컬러 설정
	  color: {
	        pattern: ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5','#FFE400']
	    },
	  //데이터 아래 나오는 이름 옵션
	    legend: {
	        show: true
	    },
	    tooltip: {
	        show: true
	    }
	});
}

/**
 * bar 차트
 * 테이더 타입 
 *  columns: {
	        	['reg_date','2020-01-01','2020-01-02','2020-01-03','2020-01-04','2020-01-05'],
	        	[봇,0,0,0,100,0],
	        	[봇2,0,0,0,100,0],
	        	[봇3,0,0,0,100,0],
	        }
	        x:축 view_date 
 * */
var barGroupChart = function(jsonData,divId,dateFormat){
	//alert(x_date);
	c3.generate({
		bindto: "#"+divId,
		data: {
			 x: 'regDate',
	        columns: [
	        	jsonData.regDate,
	        	jsonData.fieldKeywordList,
	        	jsonData.fieldKeywordList2
	        ],
	         type: 'bar',
	          groups: [
            	["정호", "별권"]
	        ],
	        order: 'asc'
	    },
	    color: {
	        pattern: ['#79ccf4','#f8a0fb']
	    },
	    axis: {
		        x: {
		        	/**
		        	 * type: 'category',
		        	 * categories: jsonData.week_reg_date,
		        	 * ["2020-09-17","2020-09-18","2020-09-19","2020-09-20","2020-09-21","2020-09-22","2020-09-23"]
		        	 *	x축 표시 데이터 중간에 표시된다.
		        	 *	사용 할려면      
		        	 *data: {
			 			x: 'reg_date',
			 		} 제외하고 사용한다. 	 
		        	 ** */ 
		            type: 'timeseries',
		            localtime: true,
		            tick: {
		                format: dateFormat
		            }
		        }
	    }
	    ,
	    grid:{ // 격자만 표시할경우 사용
	    	x:{
	    		show:false
	    	},
	    	y:{
	    		show:true
	    	}
	    	
	    }
		
	}); 
}

/**
 * bar 차트
 * 테이더 타입 
 *  columns: {
	        	['reg_date','2020-01-01','2020-01-02','2020-01-03','2020-01-04','2020-01-05'],
	        	[봇,0,0,0,100,0],
	        	[봇2,0,0,0,100,0],
	        	[봇3,0,0,0,100,0],
	        }
	        x:축 view_date 
	        
	       일일대시보드에서만 사용
 * */
var dailyBarGroupChart = function(jsonData,divId){
	//alert(x_date);
	c3.generate({
		bindto: "#"+divId,
		
		data: {
			 x: 'organDataList',
			 json: jsonData.organList,
	         type: 'bar',
	          groups: [
	        	  jsonData.categoryGroupList
	        ],
	        order: 'asc'
	    },
	    legend: {
	        position: 'right'
	    },
	    color: {
	       // pattern: ['#79ccf4','#f8a0fb']
	    },
	    
	    axis: {
		        x: {
		            type: 'category',
		            localtime: true
		           
		        }, 
		        y: {
		        	//y표시 최대 + 10건으로 표시
		        	max: jsonData.maxCnt,
		        	padding :0
		        }
		        
	    }
	    ,
	    grid:{ // 격자만 표시할경우 사용
	    	x:{
	    		show:false
	    	},
	    	y:{
	    		show:true
	    	}
	    	
	    }
		
	}); 
}


/**
 * line 차트
 * 테이더 타입 
 *  columns: {
	        	['reg_date','2020-01-01','2020-01-02','2020-01-03','2020-01-04','2020-01-05'],
	        	[봇,0,0,0,100,0],
	        	[봇2,0,0,0,100,0],
	        	[봇3,0,0,0,100,0],
	        }
	        x:축 view_date 
 * */
var lineChart = function(jsonData,divId,dateFormat){
	//alert(x_date);
	c3.generate({
		bindto: "#"+divId,
		data: {
			 x: 'regDate',
	        columns: [
	        	jsonData.regDate,
	        	jsonData.cntList
	        ],
	         type: 'spline'
	    },
	    
	    axis: {
		        x: {
		            type: 'category',
		            localtime: true,
		            tick: {
		                format: dateFormat
		            }
		        }
	    }
	    ,
	    grid:{ // 격자만 표시할경우 사용
	    	x:{
	    		show:false
	    	},
	    	y:{
	    		show:true
	    	}
	    	
	    },legend: {
	        show: false
	    }
		
	}); 
}


/**
 * line 차트
 * 테이더 타입 : json 
 * 키워드 분석에서만 사용하는 라인차트
 * */
//data: {
//    json: jsonData,
//    x:x_date,
//    type: 'bar'
//},
var linJsoneChart = function(jsonData,divId,dateFormat){
	//alert(x_date);
	c3.generate({
		bindto: "#"+divId,
		data: {
			 x: 'regDate',
			 json: jsonData,
	         type: 'spline'
	    },
	    
	    axis: {
		        x: {
		            type: 'timeseries',
		            localtime: true,
		            tick: {
		                format: dateFormat
		            }
		        }
	    }
	    ,
	    grid:{ // 격자만 표시할경우 사용
	    	x:{
	    		show:false
	    	},
	    	y:{
	    		show:true
	    	}
	    	
	    },legend: {
	        show: true
	    }
		
	}); 
}

/**
 * word_network 차트
 * 테이더 타입 
 * d3.v4.js 사용
 * 
 * nodes 1~14개일 경우
 * */
var draw_word_network = function(data, divId, keyword){
	
	var width = "700";
	var height = "490";

	var svg = d3.select("#"+divId).append("svg")
    .attr("width", width)
    .attr("height", height);	
	
	
	var color = d3.scaleOrdinal(d3.schemeCategory20);
	var simulation = d3.forceSimulation()
	    .force("link", d3.forceLink().id(function(d) { return d.id; }))
	    .force("charge", d3.forceManyBody())
//	     .force('charge', d3.forceManyBody().strength(-25))
	    .force("center", d3.forceCenter(width / 10, height / 7));
	
	var g = svg.append("g").attr("class", "node_all");
	var link = g.append("g")
	    .attr("class", "links")
	  	.selectAll("line")
	  	.data(data.links)
	  	.enter().append("line")
	    .attr("stroke-width", function(d) { return Math.sqrt(d.value); });
	
	var node = g.append("g")
	.attr("class", "nodes")
	.selectAll("rect")
	.data(data.nodes)
	.enter().append("rect")
	.attr("width", 70)
	.attr("height", 20)
	.attr("fill", function(d) { return color(d.group); })
	.call(d3.drag()
		.on("start", dragstarted)
		.on("drag", dragged)
		.on("end", dragended));
	
	var node_text = g.append("g")
	.attr("class", "node_text")
	.selectAll("text")
	.data(data.nodes)
	.enter().append("text")
	.attr("dy", ".3em")
	.style("text-anchor", "middle")
	.style("cursor", "pointer")
	.style("font-size", "12px")
	.call(d3.drag()
		.on("start", dragstarted)
		.on("drag", dragged)
		.on("end", dragended))
	.text(function(d) {
		return d.id;
	});
	
	simulation
	    .nodes(data.nodes)
	    .on("tick", ticked);

	simulation.force("link")
	    .links(data.links);
	
    var zoom = d3.zoom()                            
    .scaleExtent([0.5, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);   
	g.style("transform-origin", "50% 50% 0");
	g.style("transform", "translate(10)");
	svg.call(zoom);
	
	function zoomed() {   
		g.style('transform', 'scale(' + d3.event.transform.k + ')');
	
	}	
	
	
//	var bbox = g.node().getBBox();
//	//console.log(bbox);
	
	
	function ticked() {
		  link
		      .attr("x1", function(d) { return (d.source.x*4); })
		      .attr("y1", function(d) { return (d.source.y*3); })
		      .attr("x2", function(d) { return (d.target.x*4); })
		      .attr("y2", function(d) { return (d.target.y*3); });
		
		  node
		      .attr("x", function(d) { return (d.x*4); })
		      .attr("y", function(d) { return (d.y*3); });
		  
		  node_text
	      .attr("x", function(d) { return (d.x*4)+33; })
	      .attr("y", function(d) { return (d.y*3)+10; });
		}
	
	function dragstarted(d) {
	if (!d3.event.active) simulation.alphaTarget(0.3).restart();
	d.fx = d.x;
	d.fy = d.y;
	}
	
	function dragged(d) {
	d.fx = d3.event.x;
	d.fy = d3.event.y;
	}
	
	function dragended(d) {
	if (!d3.event.active) simulation.alphaTarget(0);
	d.fx = null;
	d.fy = null;
	}
	
}

/**
 * word_network 차트
 * 테이더 타입 
 * d3.v4.js 사용
 * 
 * nodes 15~16개일경우 
 * */
var draw_word_network2 = function(data, divId, keyword){
	
	var width = "700";
	var height = "490";

	var svg = d3.select("#"+divId).append("svg")
    .attr("width", width)
    .attr("height", height);	
	
	
	var color = d3.scaleOrdinal(d3.schemeCategory20);
	var simulation = d3.forceSimulation()
	    .force("link", d3.forceLink().id(function(d) { return d.id; }))
	    .force("charge", d3.forceManyBody())
//	     .force('charge', d3.forceManyBody().strength(-25))
	    .force("center", d3.forceCenter(width / 7, height / 6));
	
	var g = svg.append("g").attr("class", "node_all");
	var link = g.append("g")
	    .attr("class", "links")
	  	.selectAll("line")
	  	.data(data.links)
	  	.enter().append("line")
	    .attr("stroke-width", function(d) { return Math.sqrt(d.value); });
	
	var node = g.append("g")
	.attr("class", "nodes")
	.selectAll("rect")
	.data(data.nodes)
	.enter().append("rect")
	.attr("width", 70)
	.attr("height", 20)
	.attr("fill", function(d) { return color(d.group); })
	.call(d3.drag()
		.on("start", dragstarted)
		.on("drag", dragged)
		.on("end", dragended));
	
	var node_text = g.append("g")
	.attr("class", "node_text")
	.selectAll("text")
	.data(data.nodes)
	.enter().append("text")
	.attr("dy", ".3em")
	.style("text-anchor", "middle")
	.style("cursor", "pointer")
	.style("font-size", "12px")
	.call(d3.drag()
		.on("start", dragstarted)
		.on("drag", dragged)
		.on("end", dragended))
	.text(function(d) {
		return d.id;
	});
	
	simulation
	    .nodes(data.nodes)
	    .on("tick", ticked);

	simulation.force("link")
	    .links(data.links);
	
    var zoom = d3.zoom()                            
    .scaleExtent([0.5, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);   
	g.style("transform-origin", "50% 50% 0");
	g.style("transform", "translate(10)");
	svg.call(zoom);
	
	function zoomed() {   
		g.style('transform', 'scale(' + d3.event.transform.k + ')');
	
	}	
	
	
//	var bbox = g.node().getBBox();
//	//console.log(bbox);
	
	
	function ticked() {
		  link
		      .attr("x1", function(d) { return (d.source.x*3.5); })
		      .attr("y1", function(d) { return (d.source.y*2); })
		      .attr("x2", function(d) { return (d.target.x*3.5); })
		      .attr("y2", function(d) { return (d.target.y*2); });
		
		  node
		      .attr("x", function(d) { return (d.x*3.5); })
		      .attr("y", function(d) { return (d.y*2); });
		  
		  node_text
	      .attr("x", function(d) { return (d.x*3.5)+33; })
	      .attr("y", function(d) { return (d.y*2)+10; });
		}
	
	function dragstarted(d) {
	if (!d3.event.active) simulation.alphaTarget(0.3).restart();
	d.fx = d.x;
	d.fy = d.y;
	}
	
	function dragged(d) {
	d.fx = d3.event.x;
	d.fy = d3.event.y;
	}
	
	function dragended(d) {
	if (!d3.event.active) simulation.alphaTarget(0);
	d.fx = null;
	d.fy = null;
	}
	
}

/**
 * word_network 차트
 * 테이더 타입 
 * d3.v4.js 사용
 * 
 * nodes 16이상일 경우
 * */
var draw_word_network3 = function(data, divId, keyword){
	
	var width = "700";
	var height = "490";

	var svg = d3.select("#"+divId).append("svg")
    .attr("width", width)
    .attr("height", height);	
	
	
	var color = d3.scaleOrdinal(d3.schemeCategory20);
	var simulation = d3.forceSimulation()
	    .force("link", d3.forceLink().id(function(d) { return d.id; }))
	    .force("charge", d3.forceManyBody())
//	     .force('charge', d3.forceManyBody().strength(-25))
	    .force("center", d3.forceCenter(width / 6, height / 4));
	
	var g = svg.append("g").attr("class", "node_all");
	var link = g.append("g")
	    .attr("class", "links")
	  	.selectAll("line")
	  	.data(data.links)
	  	.enter().append("line")
	    .attr("stroke-width", function(d) { return Math.sqrt(d.value); });
	
	var node = g.append("g")
	.attr("class", "nodes")
	.selectAll("rect")
	.data(data.nodes)
	.enter().append("rect")
	.attr("width", 70)
	.attr("height", 20)
	.attr("fill", function(d) { return color(d.group); })
	.call(d3.drag()
		.on("start", dragstarted)
		.on("drag", dragged)
		.on("end", dragended));
	
	var node_text = g.append("g")
	.attr("class", "node_text")
	.selectAll("text")
	.data(data.nodes)
	.enter().append("text")
	.attr("dy", ".3em")
	.style("text-anchor", "middle")
	.style("cursor", "pointer")
	.style("font-size", "12px")
	.call(d3.drag()
		.on("start", dragstarted)
		.on("drag", dragged)
		.on("end", dragended))
	.text(function(d) {
		return d.id;
	});
	
	simulation
	    .nodes(data.nodes)
	    .on("tick", ticked);

	simulation.force("link")
	    .links(data.links);
	
    var zoom = d3.zoom()                            
    .scaleExtent([0.5, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);   
	g.style("transform-origin", "50% 50% 0");
	g.style("transform", "translate(10)");
	svg.call(zoom);
	
	function zoomed() {   
		g.style('transform', 'scale(' + d3.event.transform.k + ')');
	
	}	
	
	
//	var bbox = g.node().getBBox();
//	//console.log(bbox);
	
	
	function ticked() {
		  link
		      .attr("x1", function(d) { return (d.source.x*2); })
		      .attr("y1", function(d) { return (d.source.y*1.5); })
		      .attr("x2", function(d) { return (d.target.x*2); })
		      .attr("y2", function(d) { return (d.target.y*1.5); });
		
		  node
		      .attr("x", function(d) { return (d.x*2); })
		      .attr("y", function(d) { return (d.y*1.5); });
		  
		  node_text
	      .attr("x", function(d) { return (d.x*2)+33; })
	      .attr("y", function(d) { return (d.y*1.5)+10; });
		}
	
	function dragstarted(d) {
	if (!d3.event.active) simulation.alphaTarget(0.3).restart();
	d.fx = d.x;
	d.fy = d.y;
	}
	
	function dragged(d) {
	d.fx = d3.event.x;
	d.fy = d3.event.y;
	}
	
	function dragended(d) {
	if (!d3.event.active) simulation.alphaTarget(0);
	d.fx = null;
	d.fy = null;
	}
	
}
