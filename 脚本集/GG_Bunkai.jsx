/*
	GG_Bunkai
	License - GraphicsGumma
	verjon 1.4
	*/

function GG_Bunkai(thisObj){
	var filetextlist = ["GSbtn.png","Text.png","Row.png","Word.png","Chara.png","Parts.png","preon.png","preoff.png"];
	var filecheck = 0;
	var filepass = new File(new File($.fileName).parent);
	var iconpass = filepass.fullName + "/BK_icon";
	FileCheck();
	if(filecheck == filetextlist.length){
		//Script
		
		var comp;
		var complay;
		var complayva;
		var selay;
		var seleng;
		var selayindex;
		
		var selayloop = 0;
		var proloop = 0;
		var prowloop = 1;
		var texdex = [];
		var dexloop = 0;
		var texploop = 1;
		var preflag = false;
		
		var CX;
		var CY;
		var APX;
		var APY;
		var PX;
		var PY;
		var SX;
		var SY;
		var DX;
		var DY;
		var RZ;
		
		var TSmode = 0;
		
		function BuildUI(thisObj){
			var scriptname = "GG_Bunkai";
			var sm = 4;//space_marge
			var Bs = [0,0,27,28];//buttonsize
			
			var mainWin = (thisObj instanceof Panel) ? thisObj : new Window("palette" , scriptname , undefined , {resizeable:true});
			mainWin.spacing = 0;
			mainWin.margins = 4;
			var loadgrp = mainWin.add("group");
			loadgrp.orientation = "stack";
			loadgrp.alignment = ["center" , "center"];
				var Grp = loadgrp.add("group");
				Grp.spacing = sm;
				Grp.margins = 0;
				Grp.orientation = "row";
				Grp.alignment = ["center" , "center"];
					var GSbtn = Grp.add("iconbutton" , Bs , iconpass + "/" + filetextlist[0]);
					GSbtn.helpTip = "Text to Shape Convert";
					var modegrp = Grp.add("group");
					modegrp.orientation = "stack";
						var Text = modegrp.add("iconbutton" , Bs , iconpass + "/" + filetextlist[1]);
						Text.visible = true;
						Text.helpTip = "UnDivid";
						var Row = modegrp.add("iconbutton" , Bs , iconpass + "/" + filetextlist[2]);
						Row.visible = false;
						Row.helpTip = "Divide to newline";
						var Word = modegrp.add("iconbutton" , Bs , iconpass + "/" + filetextlist[3]);
						Word.visible = false;
						Word.helpTip = "Divide to space";
						var Chara = modegrp.add("iconbutton" , Bs , iconpass + "/" + filetextlist[4]);
						Chara.visible = false;
						Chara.helpTip = "Divide to character";
						var Parts = modegrp.add("iconbutton" , Bs , iconpass + "/" + filetextlist[5]);
						Parts.visible = false;
						Parts.helpTip = "Divide to path parts";
					var pregrp = Grp.add("group");
					pregrp.orientation = "stack";
						var preon = pregrp.add("iconbutton" , Bs , iconpass + "/" + filetextlist[6]);
						preon.visible = false;
						preon.helpTip = "Precompose results";
						var preoff = pregrp.add("iconbutton" , Bs , iconpass + "/" + filetextlist[7]);
						preoff.visible = true;
						preoff.helpTip = "Precompose off";
				var load = loadgrp.add("statictext" , undefined , "Script running...");
				load.alignment = ["center","center"];
				load.visible = false;
				
			GSbtn.onClick = function(){
				Grp.visible = false;
				load.visible = true;
				complaydate();
				app.beginUndoGroup("TextShapeGenerater");
				TSGenT();
				app.endUndoGroup();
				load.visible = false;
				Grp.visible = true;
			}
			Text.onClick = function(){
				Row.visible = true;
				Text.visible = false;
				TSmode++;
			}
			Row.onClick = function(){
				Word.visible = true;
				Row.visible = false;
				TSmode++;
			}
			Word.onClick = function(){
				Chara.visible = true;
				Word.visible = false;
				TSmode++;
			}
			Chara.onClick = function(){
				Parts.visible = true;
				Chara.visible = false;
				TSmode++;
			}
			Parts.onClick = function(){
				Text.visible = true;
				Parts.visible = false;
				TSmode = 0;
			}
			preon.onClick = preoff.onClick = function(){
				preon.visible = !preon.visible;
				preoff.visible = !preoff.visible;
				preflag = !preflag;
			}
		
			mainWin.layout.layout(true);
			
			mainWin.onResizing = mainWin.onResize = function(){
				this.layout.resize();
			};
			return mainWin;
		}
		var BuildUIObj = BuildUI(thisObj);
		if(!(BuildUIObj instanceof Panel))
			BuildUIObj.show();
		
		function complaydate(){
			comp = app.project.activeItem;
			if(comp != null){
				complay = comp.layers;
				complayva = comp.numLayers;
				selay = comp.selectedLayers;
				seleng = selay.length;
				if(seleng != 0)
					selayindex = selay[0].index;
				else
					selayindex = 1;
			}else
				alert("Please access compsition");
		}
		function TSGenT(){
			selayloop = 0;
			dexloop = 0;
			while(selayloop < seleng){
				if(selay[selayloop] instanceof TextLayer){
					texdex[dexloop] = selay[selayloop].index;
					dexloop++;
				}
				selay[selayloop].selected = false;
				selayloop++;
			}//while_selay_close
			texdex.sort(function dexsort(a,b){
				return a-b;
			});
			while(dexloop > 0){
				complay[texdex[dexloop-1]].selected = true;
				app.executeCommand(3781);
				if(TSmode == 4)
					Partsmarge();
				complay[texdex[dexloop-1]].selected = false;
				switch(TSmode){
					case 1://R
						Row();
						break;
					case 2://W
						Word();
						break;
					case 3://C
						Chara();
						break;
					case 4://P
						Parts();
						break;
					default:
						break;
				}
				if(preflag){
					Precomp();
				}
				dexloop--;
			}
		}//function_ShapeText_close
		function Row(){//RowBrake
			var textdate = complay[texdex[dexloop-1]+1].property("Source Text").value.text;
			var sploop = 0;
			var texpoint = 0;
			var sptflag = true;
			while(sploop < textdate.length){
				if(textdate[sploop] == "\n"||textdate[sploop] == "\r"){
					if(sptflag){
						complay[texdex[dexloop-1]].duplicate();
						complay[texdex[dexloop-1]+1].name = textdate.substr(texpoint,sploop-texpoint) + " Outline";
						while(sploop-texpoint < complay[texdex[dexloop-1]+1].property("ADBE Root Vectors Group").numProperties){
							complay[texdex[dexloop-1]+1].property("ADBE Root Vectors Group").property((sploop+1)-texpoint).remove();
						}
						AnchorRePoint(complay[texdex[dexloop-1]+1],0);
						var rsploop = 0;
						while(rsploop < sploop-texpoint){
							complay[texdex[dexloop-1]].property("ADBE Root Vectors Group").property(1).remove();
							rsploop++;
						}
						sptflag = false;
					}
					texpoint = sploop+1;
				}else{
					sptflag = true;
				}
				sploop++;
			}
			AnchorRePoint(complay[texdex[dexloop-1]],0);
			complay[texdex[dexloop-1]].name = textdate.substr(texpoint,sploop-texpoint) + " Outline";
		}
		function Word(){//SpaceBrake
			var textdate = complay[texdex[dexloop-1]+1].property("Source Text").value.text;
			var sploop = 0;
			var texpoint = 0;
			var sptflag = true;
			while(sploop < textdate.length){
				if(textdate[sploop] == "\n"||textdate[sploop] == "\r"||textdate[sploop] == "\t"||textdate[sploop] == " "||textdate[sploop] == "　"){
					if(sptflag){
						complay[texdex[dexloop-1]].duplicate();
						complay[texdex[dexloop-1]+1].name = textdate.substr(texpoint,sploop-texpoint) + " Outline";
						while(sploop-texpoint < complay[texdex[dexloop-1]+1].property("ADBE Root Vectors Group").numProperties){
							complay[texdex[dexloop-1]+1].property("ADBE Root Vectors Group").property((sploop+1)-texpoint).remove();
						}
						AnchorRePoint(complay[texdex[dexloop-1]+1],0);
						var rsploop = 0;
						while(rsploop < sploop-texpoint){
							complay[texdex[dexloop-1]].property("ADBE Root Vectors Group").property(1).remove();
							rsploop++;
						}
						sptflag = false;
					}
					texpoint = sploop+1;
				}else{
					sptflag = true;
				}
				sploop++;
			}
			AnchorRePoint(complay[texdex[dexloop-1]],0);
			complay[texdex[dexloop-1]].name = textdate.substr(texpoint,sploop-texpoint) + " Outline";
		}
		function Chara(){
			proloop = 1;
			var texnum = complay[texdex[dexloop-1]].property("ADBE Root Vectors Group").numProperties;
			while(proloop < texnum){
				complay[texdex[dexloop-1]].duplicate();
				complay[texdex[dexloop-1]+1].name = complay[texdex[dexloop-1]].property("ADBE Root Vectors Group").property(1).name + " Outline";
				while(complay[texdex[dexloop-1]+1].property("ADBE Root Vectors Group").numProperties > 1){
					complay[texdex[dexloop-1]+1].property("ADBE Root Vectors Group").property(2).remove();
				}
				AnchorRePoint(complay[texdex[dexloop-1]+1],1);
				complay[texdex[dexloop-1]].property("ADBE Root Vectors Group").property(1).remove();
				proloop++;
			}
			AnchorRePoint(complay[texdex[dexloop-1]],1);
			complay[texdex[dexloop-1]].name = complay[texdex[dexloop-1]].property("ADBE Root Vectors Group").property(1).name + " Outline";
		}
		function Parts(){
			proloop = 0;
			var texnum = complay[texdex[dexloop-1]].property("ADBE Root Vectors Group").numProperties;
			while(proloop < texnum){
				var pronum = complay[texdex[dexloop-1]].property("ADBE Root Vectors Group").property(1).property(2).numProperties-3;
				prowloop = 1;
				while(prowloop < pronum){
					complay[texdex[dexloop-1]].duplicate();
					complay[texdex[dexloop-1]+1].name = complay[texdex[dexloop-1]].property("ADBE Root Vectors Group").property(1).name + " Outline ";
					while(complay[texdex[dexloop-1]+1].property("ADBE Root Vectors Group").property(1).property(2).numProperties > 4){
						complay[texdex[dexloop-1]+1].property("ADBE Root Vectors Group").property(1).property(2).property(2).remove();
					}
					if(complay[texdex[dexloop-1]+1].property("ADBE Root Vectors Group").property(1).property(2).property(2).matchName == "ADBE Vector Filter - Merge")
						complay[texdex[dexloop-1]+1].property("ADBE Root Vectors Group").property(1).property(2).property(2).remove();
					complay[texdex[dexloop-1]].property("ADBE Root Vectors Group").property(1).property(2).property(1).remove();
					while(complay[texdex[dexloop-1]+1].property("ADBE Root Vectors Group").numProperties > 1){
						complay[texdex[dexloop-1]+1].property("ADBE Root Vectors Group").property(2).remove();
					}
					AnchorRePoint(complay[texdex[dexloop-1]+1],2);
					prowloop++;
				}
				complay[texdex[dexloop-1]].duplicate();
				complay[texdex[dexloop-1]+1].name = complay[texdex[dexloop-1]].property("ADBE Root Vectors Group").property(1).name + " Outline ";
				if(complay[texdex[dexloop-1]+1].property("ADBE Root Vectors Group").property(1).property(2).property(2).matchName == "ADBE Vector Filter - Merge")
					complay[texdex[dexloop-1]+1].property("ADBE Root Vectors Group").property(1).property(2).property(2).remove();
				while(complay[texdex[dexloop-1]+1].property("ADBE Root Vectors Group").numProperties > 1){
					complay[texdex[dexloop-1]+1].property("ADBE Root Vectors Group").property(2).remove();
				}
				AnchorRePoint(complay[texdex[dexloop-1]+1],2);
				complay[texdex[dexloop-1]].property("ADBE Root Vectors Group").property(1).remove();
				proloop++;
			}
			complay[texdex[dexloop-1]].remove();
		}
		function Partsmarge(){
			prowloop = 1;
			var pathcount = 1;
			var countloop = 1;
			while(prowloop <= comp.selectedLayers[0].property("ADBE Root Vectors Group").numProperties){//文字ループ
				pathcount = 1;
				var pathnum = 3;
				if(comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).numProperties == 3){
					pathnum--;
				}
				var area = [];
				var maxarea = 0;
				var mavec = true;
				var pathveccheckloop = 1;
				var areavecchash = [];
				var pathnowloop = 0;
				while(pathveccheckloop <= comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).numProperties-pathnum){//文字内のパス数ループ
					var nexdex = 0;
					var areachash = 0;
					for(i = 0;i < comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(pathveccheckloop).property(2).value.vertices.length;i++){
						nexdex = (i + 1) % comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(pathveccheckloop).property(2).value.vertices.length;
						areachash += comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(pathveccheckloop).property(2).value.vertices[i][0] * comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(pathveccheckloop).property(2).value.vertices[nexdex][1];
						areachash -= comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(pathveccheckloop).property(2).value.vertices[nexdex][0] * comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(pathveccheckloop).property(2).value.vertices[i][1];
					}
					if(Math.abs(areachash) > Math.abs(maxarea)){
						maxarea = areachash;
					}
					areavecchash[pathveccheckloop-1] = areachash;
					pathveccheckloop++;
				}
				if(maxarea > 0){
					mavec = false;
				}
				while(pathcount <= comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).numProperties-pathnum){//文字内のパス数ループ
					area[pathcount-1] = areavecchash[pathnowloop];
					if(area[pathcount-1] < 0 == mavec){
						countloop = 1;
						var areamove = false;
						comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).addProperty("ADBE Vector Group").moveTo(pathcount);
						comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(pathcount).property("ADBE Vector Materials Group").remove();
						comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(pathcount).name = comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(pathcount+1).name;
						comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(pathcount).property(2).addProperty("ADBE Vector Shape - Group");
						comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(pathcount).property(2).property(1).property(2).setValue( comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(pathcount+1).property(2).value );
						comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(pathcount).property(2).property(1).name = comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(pathcount+1).name;
						comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(pathcount+1).remove();
						while(countloop < pathcount){
							if(area[countloop-1] < area[pathcount-1]){
								comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(pathcount).moveTo(countloop);
								area.splice(countloop-1,0,area[pathcount-1]);
								areamove = true;
							}
							countloop++;
						}
						if(!areamove){
							comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(pathcount).moveTo(countloop);
						}
						pathcount++;
					}else{
						comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(pathcount).moveTo(comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).numProperties-3);
						pathnum++;
					}
					pathnowloop++;
				}
				countloop = 1;
				while(countloop < pathcount){
					var contentsloop = 0;
					var Mflag = false;
					var pluspath = 1;
					while(contentsloop < comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).numProperties-(pathcount+2)){
						var ppflag = false;
						var checkpoint = [comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(pathcount+contentsloop).property(2).value.vertices[0][0],comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(pathcount+contentsloop).property(2).value.vertices[0][1]]
						var cn = 0;
						var nexdex = 0;
						for(i = 0;i<comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(countloop).property(2).property(1).property(2).value.vertices.length;i++){
							nexdex = (i + 1) % comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(countloop).property(2).property(1).property(2).value.vertices.length;
							if( ( (comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(countloop).property(2).property(1).property(2).value.vertices[i][1] <= checkpoint[1])&&(comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(countloop).property(2).property(1).property(2).value.vertices[nexdex][1] > checkpoint[1]) ) || ( (comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(countloop).property(2).property(1).property(2).value.vertices[i][1] > checkpoint[1])&&(comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(countloop).property(2).property(1).property(2).value.vertices[nexdex][1] <= checkpoint[1]) ) ){
								var vt = (checkpoint[1] - comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(countloop).property(2).property(1).property(2).value.vertices[i][1]) / (comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(countloop).property(2).property(1).property(2).value.vertices[nexdex][1] - comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(countloop).property(2).property(1).property(2).value.vertices[i][1]);
								if(checkpoint[0] < (comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(countloop).property(2).property(1).property(2).value.vertices[i][0] + (vt * (comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(countloop).property(2).property(1).property(2).value.vertices[nexdex][0] - comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(countloop).property(2).property(1).property(2).value.vertices[i][0])))){
									cn++;
								}
							}
						}
						if(cn%2==0){
							ppflag = false;
						}else{
							ppflag = true;
						}
						if(ppflag == true){
							comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(countloop).property(2).addProperty("ADBE Vector Shape - Group").moveTo(2);
							comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(countloop).property(2).property(2).property(2).setValue( comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(pathcount+contentsloop).property(2).value );
							comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(countloop).property(2).property(2).name = comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(pathcount+contentsloop).name;
							comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(pathcount+contentsloop).remove();
							pluspath++;
							contentsloop--;
							if(Mflag == false){
								comp.selectedLayers[0].property("ADBE Root Vectors Group").property(prowloop).property(2).property(countloop).property(2).addProperty("ADBE Vector Filter - Merge");
								Mflag = true;
							}
						}
						contentsloop++;
					}
					countloop++;
				}
				prowloop++;
			}
		}
		function AnchorRePoint(lay,pet){
			if(lay.property("ADBE Transform Group").property("ADBE Position").numKeys != 0||lay.property("ADBE Transform Group").property("ADBE Position_0").numKeys != 0||lay.property("ADBE Transform Group").property("ADBE Position_1").numKeys != 0||lay.property("ADBE Transform Group").property("ADBE Anchor Point").numKeys != 0)
				return ;
			RZ = lay.property("ADBE Transform Group").property("ADBE Rotate Z").value;
			
			CX = lay.sourceRectAtTime(0,true).width*0.5+lay.sourceRectAtTime(0,true).left;
			CY = lay.sourceRectAtTime(0,true).height*0.5+lay.sourceRectAtTime(0,true).top;
			SX = lay.property("ADBE Transform Group").property("ADBE Scale").value[0];
			SY = lay.property("ADBE Transform Group").property("ADBE Scale").value[1];
			APX = lay.property("ADBE Transform Group").property("ADBE Anchor Point").value[0];
			APY = lay.property("ADBE Transform Group").property("ADBE Anchor Point").value[1];
			if(!lay.property("ADBE Transform Group").property("ADBE Position").dimensionsSeparated){
				PX = lay.property("ADBE Transform Group").property("ADBE Position").value[0];
				PY = lay.property("ADBE Transform Group").property("ADBE Position").value[1];
			}else{
				PX = lay.property("ADBE Transform Group").property("ADBE Position_0").value;
				PY = lay.property("ADBE Transform Group").property("ADBE Position_1").value;
			}
			lay.property("ADBE Transform Group").property("ADBE Anchor Point").setValue([0,0,0]);
			if(pet==1){
				lay.property("ADBE Root Vectors Group").property(1).property(3).property("ADBE Vector Anchor").setValue([CX,CY]);
			}else if(pet==2){
				lay.property("ADBE Root Vectors Group").property(1).property(2).property(1).property(3).property("ADBE Vector Anchor").setValue([CX,CY]);
			}else{
				lay.property("ADBE Transform Group").property("ADBE Anchor Point").setValue([CX,CY,0]);
			}
			DX = ((CX-APX)*0.01*SX);
			DY = ((CY-APY)*0.01*SY);
			if(!lay.property("ADBE Transform Group").property("ADBE Position").dimensionsSeparated){
				lay.property("ADBE Transform Group").property("ADBE Position").setValue([PX+(DX*Math.cos(RZ*(Math.PI/180))-DY*Math.sin(RZ*(Math.PI/180))),PY+(DX*Math.sin(RZ*(Math.PI/180))+DY*Math.cos(RZ*(Math.PI/180))),0]);
			}else{
				lay.property("ADBE Transform Group").property("ADBE Position_0").setValue(PX+(DX*Math.cos(RZ*(Math.PI/180))-DY*Math.sin(RZ*(Math.PI/180))));
				lay.property("ADBE Transform Group").property("ADBE Position_1").setValue(PY+(DX*Math.sin(RZ*(Math.PI/180))+DY*Math.cos(RZ*(Math.PI/180))));
			}
		}
		function Precomp(){
			var predex = [];
			var preloop = 0;
			while(preloop+texdex[dexloop-1] < texdex[dexloop-1]+(comp.numLayers-(complayva+(texdex.length-dexloop)))){
				predex[preloop] = preloop+texdex[dexloop-1];
				preloop++;
			}
			complay.precompose(predex,complay[texdex[dexloop-1]+comp.numLayers-complayva].name + " PreComp",true);
			complay[texdex[dexloop-1]].selected = false;
		}
	}//if_filecheck_clise

	function FileCheck(){
		while(filecheck < filetextlist.length){// file check
			if(new File(iconpass + "/" + filetextlist[filecheck]).exists != true){
				alert("error -- " + filetextlist[filecheck] + " does not exist.");
				break;
			}
			filecheck++;
		}
	}//FileCheck_clise
}//Script_close
GG_Bunkai(this);