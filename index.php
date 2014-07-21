<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Custom Validation Checking</title>
        <script src="js/jquery.min.js" type="text/javascript" ></script>
        <script src="js/jQuery.custom.validation.js" type="text/javascript"></script>
        <link rel="stylesheet" href="css/style.css" />
        <link rel="stylesheet" href="css/custom.validation.css" />
    </head>
    <body>
        <div style="width:800px; margin:auto; padding:30px 15px 0px 15px;">
        	<form method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>" id="validateform">
            	<table>
                	<tr>
                    	<td>Blank Checking</td>
                        <td><input type="text" class="required" name="test1" value="" /></td>
                    </tr>
                    <tr>
                    	<td>Blank And Number Checking</td>
                        <td><input type="text" class="required numeric" name="test2" value="" /></td>
                    </tr>
                    <tr>
                    	<td>Blank And Email Checking</td>
                        <td><input type="text" class="required email" name="test3" value="" /></td>
                    </tr>
                    <tr>
                    	<td>Select Field Blank Checking</td>
                        <td>
                        	<select class="width100 required" name="test4">
                            	<option value="">Select Option</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                    	<td>CheckBox with Required</td>
                        <td>
                        	<label><input type="checkbox" class="required" name="test5[]" value="" /> Check 1</label>
                            <label><input type="checkbox" class="required" name="test5[]" value="" /> Check 2</label>
                            <label><input type="checkbox" class="required" name="test5[]" value="" /> Check 3</label>
                            <label><input type="checkbox" class="required" name="test5[]" value="" /> Check 4</label>
                        </td>
                    </tr>
                    <tr>
                    	<td>Radio with Required</td>
                        <td>
                        	<label><input type="radio" class="required" name="test6" value="" /> Radio 1</label>
                            <label><input type="radio" class="required" name="test6" value="" /> Radio 2</label>
                            <label><input type="radio" class="required" name="test6" value="" /> Radio 3</label>
                            <label><input type="radio" class="required" name="test6" value="" /> Radio 4</label>
                        </td>
                    </tr>
                    <tr>
                    	<td>File with Required</td>
                        <td>
                        	<input type="file" name="test7" class="required" value="" />
                        </td>
                    </tr>
                    <tr>
                    	<td colspan="2" align="center">
                        	<input type="submit" value="Submit" name="sub">
                        </td>
                    </tr>
                </table>
            </form>
        </div>
     <script>
	 	activateValidation('validateform', 
			{ 
				'test5[]': 'Custom Message For Checkbox', 
				'test2': { 
					'required':'This Field is So Important it\'s required', 
					'numeric':'This Message is for numeric field'
					},
				'test1': 'Required !! This field',
				'test6': 'No message !!'
			},'inline');
	 </script>
    </body>
</html>
