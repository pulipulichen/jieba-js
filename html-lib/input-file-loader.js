// <input type="file" class="input-field" id="input_csv_file" load_content_to="#inpu_csv_file_textarea" />

$(function () {
    $("input:file[load_content_to]").change(function(evt) {
        //console.log(1);
        if(!window.FileReader) return; // Browser is not compatible
        
        var _input = $(this);
        var _load_content_to = $(_input.attr("load_content_to"));
        if (_load_content_to.length === 0) {
            return;
        }

        var reader = new FileReader();
        var _original_file_name = evt.target.files[0].name;
        
        if (_input.attr("load_filename_to") !== undefined) {
           var _load_filename_to = $(_input.attr("load_filename_to"));
           if (_load_filename_to.length !== 0) {
               _load_filename_to.val(_original_file_name).change();
           }
        }

        reader.onload = function(evt) {
            if(evt.target.readyState !== 2) return;
            if(evt.target.error) {
                alert('Error while reading file');
                return;
            }

            var _file_content =  evt.target.result;
            _load_content_to.val(_file_content).change();
            _input.val("");
        };

        reader.readAsText(evt.target.files[0]);
    });
    
});

