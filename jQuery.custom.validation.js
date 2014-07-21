(function($) {
	
	$.customValidate = {
		
		errorCount:0,
		radioAndCheckArray:[],
		errorDisplayStyle: ['floatingDiv','inline'],
		
		containerSelectAttr:'error-holder[data-controller="error"]',
		inlineSelectAttr:'label.error[field-name]',
		className:'required',
		numericClassName:'numeric',
		intClassName:'digit',
		emailAddressClassName:'email',
		
		numericReg:/[^0-9.]/,
		intReg:/[^0-9]/,
		emailReg:/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		
		html:'<div class="container"><ul class="error-list">*-*-*</ul></div>',
		inlineHtml:'<ul class="error-list">*-*-*</ul>',
		errorList:'',
		
		_withOption: function(formId, options, errorDisplayStyle, callback) {
			var thisForm=jQuery('#'+formId);
			var self=$.customValidate;
			self._init(thisForm, options, errorDisplayStyle, function(remainError){
				if(errorDisplayStyle===self.errorDisplayStyle[0]) self._positioningErrorDiv();
				self._bindRemoveErrorBlog(errorDisplayStyle);
				if(parseInt(remainError)>0){ self.errorCount=0; callback(false); }
			});
		},
		
		_withOutOption: function(formId, errorDisplayStyle, callback) {
			var thisForm=jQuery('#'+formId);
			var self=$.customValidate;
			self._init(thisForm, undefined, errorDisplayStyle, function(remainError){
				if(errorDisplayStyle===self.errorDisplayStyle[0]) self._positioningErrorDiv();
				self._bindRemoveErrorBlog(errorDisplayStyle);
				if(parseInt(remainError)>0){ self.errorCount=0; callback(false); }
			});
		},
		
		_init: function(thisForm, customMessage, errorDisplayStyle, callback){
			if(typeof(callback)==='function'){
				var self=$.customValidate;
				var errorCount=0;
				if(errorDisplayStyle===self.errorDisplayStyle[0]) jQuery('.'+self.containerSelectAttr).remove();
				
				thisForm.find('.'+self.className).each(function(){
					var selectedField=jQuery(this);
					
					self._completeValidate(selectedField, customMessage, errorDisplayStyle, function(errorList, returnedErrorCount){
						errorCount=returnedErrorCount;
						if(self._trim(self.errorList)!==''){
							self._bindChangeEvent(selectedField, errorDisplayStyle);
							if(errorDisplayStyle===self.errorDisplayStyle[0]){
								self._addHtml(selectedField, self._trim(self.errorList), function(receivedHtml){
									selectedField.parent().append(receivedHtml);
								});
							}
							else if(errorDisplayStyle===self.errorDisplayStyle[1]){
								if ((!selectedField.siblings('label').is(self.inlineSelectAttr) && selectedField.context.type!=='checkbox' && selectedField.context.type!=='radio') || (!selectedField.parent().siblings('label').last().is(self.inlineSelectAttr) && selectedField.parent().is('label') && (selectedField.context.type==='checkbox' || selectedField.context.type==='radio')) || (!selectedField.last().is(self.inlineSelectAttr) && !selectedField.parent().is('label') && (selectedField.context.type==='checkbox' || selectedField.context.type==='radio'))){
									if(selectedField.context.type==='checkbox' || selectedField.context.type==='radio'){
										if(selectedField.parent().is( "label")){ 
											selectedField.parent().siblings('label').last().after('<label class="error" input-type="'+selectedField.context.type+'" field-name="'+selectedField.attr('name')+'" node-name="'+selectedField.context.nodeName+'" data-attr="error">'+$.customValidate.inlineHtml.replace('*-*-*', $.customValidate.errorList)+'</label>'); 
										}
										else{
											jQuery('[name="'+selectedField.attr('name')+'"]').last().after('<label class="error" input-type="'+selectedField.context.type+'" field-name="'+selectedField.attr('name')+'" node-name="'+selectedField.context.nodeName+'" data-attr="error">'+$.customValidate.inlineHtml.replace('*-*-*', $.customValidate.errorList)+'</label>');
										}
									}
									else{
											selectedField.removeClass('success').addClass('error').parent().append('<label class="error" input-type="'+selectedField.context.type+'" field-name="'+selectedField.attr('name')+'" node-name="'+selectedField.context.nodeName+'" data-attr="error">'+$.customValidate.inlineHtml.replace('*-*-*', $.customValidate.errorList)+'</label>');
									}
								}
								else{
									if(selectedField.context.type!=='checkbox' && selectedField.context.type!=='radio'){
										selectedField.removeClass('success').addClass('error').siblings(self.inlineSelectAttr).removeClass('hide').find('ul.error-list').html(self.errorList);
									}
								}
							}
						}
					});
				});
				self.radioAndCheckArray=[];
				//if(errorCount>0){ jQuery('') }
				callback(errorCount);
			}
		},
		
		_completeValidate:function(selectedField, customMessage, errorDisplayStyle, callback){
			var self=$.customValidate;
			self.errorList='';
			if(selectedField.context.type!=='checkbox' && selectedField.context.type!=='radio')
			{
				//blank checking function call
				self._blankChecking(selectedField, function(blankCheck){
					if(blankCheck){ 
						if(selectedField.context.type!=='file'){ 
							if(customMessage===undefined){ 
								self.errorList+=self._getMessage('blank'); 
							}
							else{
								var name=selectedField.attr('name');
								if(customMessage[name]!==undefined){ if(customMessage[name][self.className]!==undefined){ self.errorList+=self._getMessage('blank',customMessage[name][self.className]); }else{ self.errorList+=self._getMessage('blank',customMessage[name]); }}else{ self.errorList+=self._getMessage('blank'); }}
						}
						else if(selectedField.context.type==='file'){ 
							if(customMessage===undefined){ self.errorList+=self._getMessage('noFileSelected'); }
							else{
								var name=selectedField.attr('name'); 
								if(customMessage[name]!==undefined){ if(customMessage[name][self.className]!==undefined){ self.errorList+=self._getMessage('noFileSelected',customMessage[name][self.className]); }else{ self.errorList+=self._getMessage('noFileSelected',customMessage[name]); }}else{ self.errorList+=self._getMessage('noFileSelected'); }}
							} 
							self.errorCount++; 
					}
					else{
						if(errorDisplayStyle===self.errorDisplayStyle[1]){
							selectedField.removeClass('error').addClass('success').siblings(self.inlineSelectAttr).find('ul.error-list>li.blank').addClass('hide');
						}
					}
				});
				//numeric checking function call	
				if(selectedField.hasClass(self.numericClassName)){
					self._numericChecking(selectedField, function(numericCheck){
						if(numericCheck){ 
							if(customMessage===undefined){ self.errorList+=self._getMessage('noNumeric'); } 
							else{
								var name=selectedField.attr('name');
								if(customMessage[name]!==undefined){ if(customMessage[name][self.numericClassName]!==undefined){ self.errorList+=self._getMessage('noNumeric',customMessage[name][self.numericClassName]); }else{ self.errorList+=self._getMessage('noNumeric',customMessage[name]); }}else{ self.errorList+=self._getMessage('noNumeric'); }  
							}
							self.errorCount++; 
						}
						else{
							if(errorDisplayStyle===self.errorDisplayStyle[1]){
								selectedField.removeClass('error').addClass('success').siblings(self.inlineSelectAttr).find('ul.error-list>li.noNumeric').addClass('hide');
							}
						}
					});
				}
				//int checking function call
				if(selectedField.hasClass(self.intClassName)){
					self._intChecking(selectedField, function(intCheck){
						if(intCheck){ 
							if(customMessage===undefined){ self.errorList+=self._getMessage('noInt'); } 
							else{
								var name=selectedField.attr('name');
								if(customMessage[name]!==undefined){ if(customMessage[name][self.intClassName]!==undefined){ self.errorList+=self._getMessage('noInt',customMessage[name][self.intClassName]); }else{ self.errorList+=self._getMessage('noInt',customMessage[name]); }}else{ self.errorList+=self._getMessage('noInt'); }}
							self.errorCount++; 
						}
						else{
							if(errorDisplayStyle===self.errorDisplayStyle[1]){
								selectedField.removeClass('error').addClass('success').siblings(self.inlineSelectAttr).find('ul.error-list>li.noInt').addClass('hide');
							}
						}
					});
				}
				//email checking function call
				if(selectedField.hasClass(self.emailAddressClassName)){
					self._emailChecking(selectedField, function(emailCheck){
						if(emailCheck){ 
							if(customMessage===undefined){ self.errorList+=self._getMessage('noEmail'); } 
							else{
								var name=selectedField.attr('name');
								if(customMessage[name]!==undefined){ if(customMessage[name][self.emailAddressClassName]!==undefined){ self.errorList+=self._getMessage('noEmail',customMessage[name][self.emailAddressClassName]); }else{ self.errorList+=self._getMessage('noEmail',customMessage[name]); }}else{ self.errorList+=self._getMessage('noEmail'); }}
							self.errorCount++; 
						}
						else{
							if(errorDisplayStyle===self.errorDisplayStyle[1]){
								selectedField.removeClass('error').addClass('success').siblings(self.inlineSelectAttr).find('ul.error-list>li.noEmail').addClass('hide');
							}
						}
					});
				}
			}
			else{
				if(jQuery.inArray(selectedField.attr('name'),self.radioAndCheckArray)===-1){
					self.radioAndCheckArray.push(selectedField.attr('name'));
					if(!jQuery(selectedField.context.nodeName+'[name="'+selectedField.attr('name')+'"]').is(':checked')){
						self.errorCount++;
						if(selectedField.context.type==='checkbox'){ 
							if(customMessage===undefined){ self.errorList+=$.customValidate._getMessage('noCheckSelected'); }
							else{
								var name=selectedField.attr('name');
								if(customMessage[name]!==undefined){  self.errorList+=self._getMessage('noCheckSelected',customMessage[name]); }else{ self.errorList+=self._getMessage('noCheckSelected'); }
							}
						}
						else if(selectedField.context.type==='radio'){ 
							if(customMessage===undefined){ self.errorList+=$.customValidate._getMessage('noRadioSelected'); }
							else{
								var name=selectedField.attr('name');
								if(customMessage[name]!==undefined){  self.errorList+=self._getMessage('noRadioSelected',customMessage[name]); }else{ self.errorList+=self._getMessage('noRadioSelected'); }
							}
						}
					}
					else{
						if(selectedField.parent().is( "label")){ if(selectedField.parent().siblings('label').last().is(self.inlineSelectAttr)){ selectedField.parent().siblings('label').last().addClass('hide'); } 
						}
						else{ if(selectedField.last().is(self.inlineSelectAttr)){ selectedField.last().addClass('hide'); }
						}
					}
				}
			}
			callback(self.errorList, self.errorCount);
		},
		
		//add the html 
		_addHtml: function(selectedField, inCludeHtml, callback){
			if(typeof(callback)==='function')
			{
				var topPosition=selectedField.position().top-selectedField.outerHeight();
				var leftPosition=selectedField.position().left+selectedField.outerWidth();
				
				var str=$.customValidate.html;
				str=str.replace('*-*-*', inCludeHtml);
				if(selectedField.context.type!=='radio' && selectedField.context.type!=='checkbox')
				{
					var wrapperHtml='<div class="error-holder arrow" data-controller="error" for="'+selectedField.attr('name')+'" node-name="'+selectedField.context.nodeName+'" field-type="'+selectedField.context.type+'" style="top:'+topPosition+'px; left:'+leftPosition+'px; visibility:hidden;">'+str+'</div>';
				}
				else
				{
					var wrapperHtml='<div class="error-holder" data-controller="error" for="'+selectedField.attr('name')+'" node-name="'+selectedField.context.nodeName+'" field-type="'+selectedField.context.type+'" style="top:'+topPosition+'px; left:'+leftPosition+'px; visibility:hidden;">'+str+'</div>';
				}
				callback(wrapperHtml);
			}
		},
		
		//set the position the error displaying div while window will be resized
		_positioningErrorDiv:function(){
			var self=$.customValidate;
			jQuery('.'+self.containerSelectAttr).each(function(index, element) {
                var selectedErrorDiv, selectedField, errorTopPosition, errorleftPosition;
				selectedErrorDiv=jQuery(this);
				
				if(selectedErrorDiv.attr('field-type')!=='radio' && selectedErrorDiv.attr('field-type')!=='checkbox'){ 
					selectedField=jQuery(selectedErrorDiv.attr('node-name')+'[name="'+selectedErrorDiv.attr('for')+'"]'); 
					errorTopPosition=selectedField.position().top-(selectedErrorDiv.find('div.container').outerHeight()+5);
					if((selectedErrorDiv.position().left+selectedErrorDiv.find('div.container').outerWidth())>jQuery(window).width()){
						errorleftPosition=jQuery(window).width()-selectedErrorDiv.find('div.container').outerWidth();
					}
					else{
						errorleftPosition=(selectedField.position().left+selectedField.outerWidth())-((selectedErrorDiv.find('div.container').outerWidth()/4)+10);
					}
				}
				else{ 
					selectedField=jQuery(selectedErrorDiv.attr('node-name')+'[name="'+selectedErrorDiv.attr('for')+'"]').eq(0);
					errorTopPosition=selectedField.position().top-(selectedErrorDiv.find('div.container').outerHeight()+5);
					errorleftPosition=(selectedField.position().left+selectedField.find('div.container').outerWidth())-17;
				}
				selectedErrorDiv.css({'top':errorTopPosition, 'left':errorleftPosition, 'visibility':'visible'});
            });
		},
		
		//checking the field is blank or not
		//return true if it is blank else return false
		_blankChecking:function(This, callback){
			if(typeof(callback==='function')){
				if($.customValidate._trim(This.val())==''){ callback(true); }else{ callback(false); }
			}
		},
		
		//checking the field is numeric/float or not
		//return true if it is not numeric else return false
		_numericChecking:function(This, callback){
			if(typeof(callback==='function')){
				var self=$.customValidate;
				if(self._trim(This.val())!==''){ if(self.numericReg.test(self._trim(This.val()))){ callback(true); }else{ if(jQuery.isNumeric(self._trim(This.val()))){ callback(false); }else{ callback(true); }}}else{ callback(true); }
			}
		},
		
		//checking the field is integer or not
		//return true if it is not int else return false
		_intChecking:function(This, callback){
			if(typeof(callback==='function')){
				var self=$.customValidate;
				if(self._trim(This.val())!==''){ if(self.intReg.test(self._trim(This.val()))){ callback(true); }else{if(jQuery.isNumeric(self._trim(This.val()))){ callback(false); }else{ callback(true); }}}else{ callback(true); }
			}
		},
		
		//checking the field contain valid email or not
		//return true if it is not int else return false
		_emailChecking:function(This, callback){
			if(typeof(callback==='function')){
				var self=$.customValidate;
				if(self._trim(This.val())!==''){ if(self.emailReg.test(self._trim(This.val()))){ callback(false); }else{ callback(true); }}else{ callback(true); }
			}
		},
		
		//trim the string value
		_trim:function(str, charlist) {
		  var whitespace, l = 0,
			i = 0;
		  str += '';
		
		  if (!charlist) {
			// default list
			whitespace = " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
		  } else {
			// preg_quote custom list
			charlist += '';
			whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
		  }
		
		  l = str.length;
		  for (i = 0; i < l; i++) {
			if (whitespace.indexOf(str.charAt(i)) === -1) {
			  str = str.substring(i);
			  break;
			}
		  }
		
		  l = str.length;
		  for (i = l - 1; i >= 0; i--) {
			if (whitespace.indexOf(str.charAt(i)) === -1) {
			  str = str.substring(0, i + 1);
			  break;
			}
		  }
		
		  return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
		},
		
		//get message for each error
		_getMessage:function(messageFor, message){
			var self=$.customValidate;
			var returnedMessage;
			switch(self._trim(messageFor))
			{
				case 'blank':
					returnedMessage = (message===undefined) ? '<li class="blank">* This Field is Required</li>' : '<li class="blank">* '+self._trim(message)+'</li>';
					return returnedMessage;
					break;
				
				case 'noPhone':
					returnedMessage = (message===undefined) ? '<li class="noPhone">* Put a Valid Phone No.</li>' : '<li class="noPhone">* '+self._trim(message)+'</li>';
					return returnedMessage;
					break;
				
				case 'noEmail':
					returnedMessage = (message===undefined) ? '<li class="noEmail">* Put a Valid Email.</li>' : '<li class="noEmail">* '+self._trim(message)+'</li>';
					return returnedMessage;
					break;
				
				case 'noNumeric':
					returnedMessage = (message===undefined) ? '<li class="noNumeric">* Put Only Numeric/Float Value.</li>' : '<li class="noNumeric">* '+self._trim(message)+'</li>';
					return returnedMessage;
					break;
				
				case 'noInt':
					returnedMessage = (message===undefined) ? '<li class="noInt">* Put Only Integer Value.</li>' : '<li class="noInt">* '+self._trim(message)+'</li>';
					return returnedMessage;
					break;
				
				case 'noCheckSelected':
					returnedMessage = (message===undefined) ? '<li class="noCheckSelected">* Please Check a Option.</li>' : '<li class="noCheckSelected">* '+self._trim(message)+'</li>';
					return returnedMessage;
					break;
				
				case 'noRadioSelected':
					returnedMessage = (message===undefined) ? '<li class="noRadioSelected">* Please Select a Option.</li>' : '<li class="noRadioSelected">* '+self._trim(message)+'</li>';
					return returnedMessage;
					break;
				
				case 'noFileSelected':
					returnedMessage = (message===undefined) ? '<li class="blank">* Please Select a File to Upload.</li>': '<li class="blank">* '+self._trim(message)+'</li>';
					return returnedMessage;
					break;
			}
		},
		
		// remove error blog while click
		_bindRemoveErrorBlog:function(errorDisplayStyle){
			var self=$.customValidate;
			if(errorDisplayStyle===this.errorDisplayStyle[0]){
				jQuery(document).on("click", "."+this.containerSelectAttr, function() { 
					jQuery(jQuery(this).attr('node-name')+'[name="'+jQuery(this).attr('for')+'"]').focus();
					jQuery(this).fadeOut(200, function() { jQuery(this).remove(); });
				});
				jQuery(window).resize(function(){ self._positioningErrorDiv(); });
			}
			else if(errorDisplayStyle===this.errorDisplayStyle[1]){
				jQuery(document).on("click", this.inlineSelectAttr, function() {
					jQuery(jQuery(this).attr('node-name')+'[name="'+jQuery(this).attr('field-name')+'"]').focus();
				});
				jQuery(document).find('.'+self.className+'.error').eq(0).focus();
			}
		},
		
		//remove error while value will be changed and will appear again
		_bindChangeEvent: function(selectedElement, errorDisplayStyle){
			var self=$.customValidate;
			if(selectedElement.context.type!=='radio' && selectedElement.context.type!=='checkbox')
			{
				var numericPresent=selectedElement.hasClass(self.numericClassName);
				var intPresent=selectedElement.hasClass(self.intClassName);
				var emailPresent=selectedElement.hasClass(self.emailAddressClassName);
				
				selectedElement.on("change keyup",function(){
					self._blankChecking(selectedElement, function(blankCheck){
						if(!blankCheck){  
							if(errorDisplayStyle===self.errorDisplayStyle[1]){ selectedElement.removeClass('error').addClass('success').siblings(self.inlineSelectAttr).find('ul.error-list>li.blank').addClass('hide'); }
							else if(errorDisplayStyle===self.errorDisplayStyle[0]){  
								var thisField=jQuery('.'+self.containerSelectAttr+'[for="'+selectedElement.attr('name')+'"]');
								thisField.find('ul.error-list>li.blank').addClass('hide');
								if(thisField.find('ul>li').length==thisField.find('ul>li.hide').length) thisField.addClass('hide'); 
							}
						}
						else{
							if(errorDisplayStyle===self.errorDisplayStyle[1]){ selectedElement.removeClass('success').addClass('error').siblings(self.inlineSelectAttr).find('ul.error-list>li.blank').removeClass('hide'); }
							else if(errorDisplayStyle===self.errorDisplayStyle[0]){  
								var thisField=jQuery('.'+self.containerSelectAttr+'[for="'+selectedElement.attr('name')+'"]');
								thisField.find('ul.error-list>li.blank').removeClass('hide');
								if(thisField.find('ul>li').length!=thisField.find('ul>li.hide').length) thisField.removeClass('hide');
							}
						}
						if(errorDisplayStyle===self.errorDisplayStyle[0]) self._positioningErrorDiv();
					});
					if(numericPresent){
						self._numericChecking(selectedElement, function(numericCheck){
							if(!numericCheck){ 
								if(errorDisplayStyle===self.errorDisplayStyle[1]){ selectedElement.removeClass('error').addClass('success').siblings(self.inlineSelectAttr).find('ul.error-list>li.noNumeric').addClass('hide'); }
								else if(errorDisplayStyle===self.errorDisplayStyle[0]){  
									var thisField=jQuery('.'+self.containerSelectAttr+'[for="'+selectedElement.attr('name')+'"]');
									thisField.find('ul.error-list>li.noNumeric').addClass('hide');
									if(thisField.find('ul>li').length==thisField.find('ul>li.hide').length) thisField.addClass('hide'); 
								}
							}
							else{
								if(errorDisplayStyle===self.errorDisplayStyle[1]){ selectedElement.removeClass('success').addClass('error').siblings(self.inlineSelectAttr).find('ul.error-list>li.noNumeric').removeClass('hide'); }
								else if(errorDisplayStyle===self.errorDisplayStyle[0]){  
									var thisField=jQuery('.'+self.containerSelectAttr+'[for="'+selectedElement.attr('name')+'"]');
									thisField.find('ul.error-list>li.noNumeric').removeClass('hide');
									if(thisField.find('ul>li').length!=thisField.find('ul>li.hide').length) thisField.removeClass('hide'); 
								}
							}
							if(errorDisplayStyle===self.errorDisplayStyle[0]) self._positioningErrorDiv();
						});
					}
					if(intPresent){
						self._intChecking(selectedElement, function(intCheck){
							if(!intCheck){ 
								if(errorDisplayStyle===self.errorDisplayStyle[1]){ selectedElement.removeClass('error').addClass('success').siblings(self.inlineSelectAttr).find('ul.error-list>li.noInt').addClass('hide'); }
								else if(errorDisplayStyle===self.errorDisplayStyle[0]){  
									var thisField=jQuery('.'+self.containerSelectAttr+'[for="'+selectedElement.attr('name')+'"]');
									thisField.find('ul.error-list>li.noInt').addClass('hide');
									if(thisField.find('ul>li').length==thisField.find('ul>li.hide').length) thisField.addClass('hide'); 
								}
							}
							else{
								if(errorDisplayStyle===self.errorDisplayStyle[1]){ selectedElement.removeClass('success').addClass('error').siblings(self.inlineSelectAttr).find('ul.error-list>li.noInt').removeClass('hide'); }
								else if(errorDisplayStyle===self.errorDisplayStyle[0]){  
									var thisField=jQuery('.'+self.containerSelectAttr+'[for="'+selectedElement.attr('name')+'"]');
									thisField.find('ul.error-list>li.noInt').removeClass('hide');
									if(thisField.find('ul>li').length!=thisField.find('ul>li.hide').length) thisField.removeClass('hide'); 
								}
							}
							if(errorDisplayStyle===self.errorDisplayStyle[0]) self._positioningErrorDiv();
						});
					}
					if(emailPresent){
						self._emailChecking(selectedElement, function(emailCheck){
							if(!emailCheck){
								if(errorDisplayStyle===self.errorDisplayStyle[1]){ selectedElement.removeClass('error').addClass('success').siblings(self.inlineSelectAttr).find('ul.error-list>li.noEmail').addClass('hide'); }
								else if(errorDisplayStyle===self.errorDisplayStyle[0]){  
									var thisField=jQuery('.'+self.containerSelectAttr+'[for="'+selectedElement.attr('name')+'"]');
									thisField.find('ul.error-list>li.noEmail').addClass('hide');
									if(thisField.find('ul>li').length==thisField.find('ul>li.hide').length) thisField.addClass('hide'); 
								}
							}
							else{
								if(errorDisplayStyle===self.errorDisplayStyle[1]){ selectedElement.removeClass('success').addClass('error').siblings(self.inlineSelectAttr).find('ul.error-list>li.noEmail').removeClass('hide'); }
								else if(errorDisplayStyle===self.errorDisplayStyle[0]){  
									var thisField=jQuery('.'+self.containerSelectAttr+'[for="'+selectedElement.attr('name')+'"]');
									thisField.find('ul.error-list>li.noEmail').removeClass('hide');
									if(thisField.find('ul>li').length!=thisField.find('ul>li.hide').length) thisField.removeClass('hide'); 
								}
							}
							if(errorDisplayStyle===self.errorDisplayStyle[0]) self._positioningErrorDiv();
						});
					}
				});
			}
			else
			{
				var selectedCheckRadio=jQuery(selectedElement.context.nodeName+'[name="'+selectedElement.attr('name')+'"]');
				selectedCheckRadio.on("click",function(){
					if(selectedCheckRadio.is(':checked')){
						if(errorDisplayStyle===self.errorDisplayStyle[1]){
							if(selectedElement.parent().is( "label")){ 
								if(selectedElement.parent().siblings('label').last().is(self.inlineSelectAttr)){ 
									selectedElement.parent().siblings('label').last().addClass('hide'); 
								} 
							}
							else{ 
								if(selectedElement.last().is(self.inlineSelectAttr)){ 
									selectedElement.last().addClass('hide'); 
								}
							}
						}
						else if(errorDisplayStyle===self.errorDisplayStyle[0]){ 
							jQuery('.'+self.containerSelectAttr+'[for="'+selectedElement.attr('name')+'"]').addClass('hide'); 
						}
					}
					else{
						if(errorDisplayStyle===self.errorDisplayStyle[1]){
							if(selectedElement.parent().is( "label")){ 
								selectedElement.parent().siblings('label').last().removeClass('hide'); 
							}
							else{
								selectedElement.last().removeClass('hide');
							}
						}
						else if(errorDisplayStyle===self.errorDisplayStyle[0]){ 
							jQuery('.'+self.containerSelectAttr+'[for="'+selectedElement.attr('name')+'"]').removeClass('hide');  
						}
					}
				});
			}
		}
	};
	
	//decide which function to call when the form get submitted
	customValidation = function(formId, options, errorDisplayStyle, event) {
		if(formId!==undefined){
			if(options===undefined){
				$.customValidate._withOutOption(formId, errorDisplayStyle, function(result){
					if(!result) (event.preventDefault) ? event.preventDefault() : event.returnValue = false; else $('#'+formId).unbind( event );
 				});
			}
			else{
				$.customValidate._withOption(formId, options, errorDisplayStyle, function(result){
					if(!result) (event.preventDefault) ? event.preventDefault() : event.returnValue = false; else $('#'+formId).unbind( event );
				});
			}
		}
	}
	
	//activate validation
	activateValidation = function( formId, options, errorDisplayStyle ){
		var self=$.customValidate;
		if(options===undefined && errorDisplayStyle===undefined){ jQuery('#'+formId).attr('onSubmit', "return customValidation('"+formId+"', undefined, 'floatingDiv', event)"); }
		else if(options!==undefined && errorDisplayStyle===undefined){
			if(typeof(options)==='object'){
				jQuery('#'+formId).attr('onSubmit', "return customValidation('"+formId+"', "+JSON.stringify(options)+", 'floatingDiv', event)"); 
			}
			else{ 
				if(jQuery.inArray(self._trim(options), self.errorDisplayStyle)!=-1){
					jQuery('#'+formId).attr('onSubmit', "return customValidation('"+formId+"', undefined, '"+$.customValidate._trim(options)+"', event)"); 
				}
				else{
					console.log('please write valid option!!');
					jQuery('#'+formId).attr('onSubmit', "return customValidation('"+formId+"', undefined, 'floatingDiv', event)"); 
				}
			}
		}
		else if(options===undefined && errorDisplayStyle!==undefined){
			if(jQuery.inArray(self._trim(errorDisplayStyle), self.errorDisplayStyle)!=-1){
				jQuery('#'+formId).attr('onSubmit', "return customValidation('"+formId+"', undefined, '"+$.customValidate._trim(errorDisplayStyle)+"', event)");
			}
			else{ 
				console.log('please write a valid errorDisplayStyle name!!');
				jQuery('#'+formId).attr('onSubmit', "return customValidation('"+formId+"', undefined, 'floatingDiv', event)");
			}
		}
		else if(options!==undefined && errorDisplayStyle!==undefined){
			if(typeof(options)==='object'){
				if(jQuery.inArray(self._trim(errorDisplayStyle), self.errorDisplayStyle)!=-1){
					jQuery('#'+formId).attr('onSubmit', "return customValidation('"+formId+"', "+JSON.stringify(options)+", '"+self._trim(errorDisplayStyle)+"', event)");
				}
				else{
					console.log('please write a valid errorDisplayStyle name!!');
					jQuery('#'+formId).attr('onSubmit', "return customValidation('"+formId+"', "+JSON.stringify(options)+", 'floatingDiv', event)");
				}
			}
			else{
				console.log('Please Write valid format of options!!');
				jQuery('#'+formId).attr('onSubmit', "return customValidation('"+formId+"', undefined, 'floatingDiv', event)");
			}
		}
	}
	
})(jQuery);
