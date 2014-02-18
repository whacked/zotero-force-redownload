Zotero.HelloWorldZotero = {
    tempDir: "/tmp",

    dateString: function () {
        function padwith0(n, len) {
            len = len || 2;
            var mypad = "000000";
            return mypad.slice(0, len - n.toString().length) + n;
        }
        var d = new Date();
        return "" + d.getFullYear() + "-" + padwith0(d.getMonth() + 1) + "-" + padwith0(d.getDate()) +
            " " + padwith0(d.getHours()) + ":" + padwith0(d.getMinutes()) + ":" + padwith0(d.getSeconds()) + "." + d.getMilliseconds();
    },
	
	init: function () {
	},

    // move the file to /tmp with a time-unique name
    doMove: function() {
        var ps = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
            .getService(Components.interfaces.nsIPromptService);
        function pp(s) {
            ps.alert(null, "", s);
        }
		
        var tomove_list = [];
        var selected_items = ZoteroPane.getSelectedItems();
        for each(var item in selected_items) {
            // if selected item is itself an attachment
            if(item.isAttachment()) {
                //tomove_list.push(item.getField("key"));
                tomove_list.push(Zotero.Attachments.getStorageDirectory(item.itemID));
            } else {
                // if selected item is a normal entry, find its attachments
                for each(var attID in item.getAttachments()) {
                    if(typeof(attID) != "number") {
                        continue;
                    }
                    var attItem = Zotero.Items.get(attID)
                    var filename = attItem.getFilename();
                    if(!filename.toLowerCase().endsWith(".pdf")) {
                        continue;
                    }
                    tomove_list.push(Zotero.Attachments.getStorageDirectory(attItem.itemID));
                }
            }
        }
        for each(var fobj in tomove_list) {
            var move_target = fobj.leafName + "_" + this.dateString();
            // pp(fobj.path + "\n--------->\n" + move_target);
            var tmpdir = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);
            tmpdir.initWithPath(this.tempDir);
            fobj.moveTo(tmpdir, move_target);
        }
    },
	
	insertHello: function() {
		var data = {
			title: "Zotero",
			company: "Center for History and New Media",
			creators: [
				['Dan', 'Stillman', 'programmer'],
				['Simon', 'Kornblith', 'programmer']
			],
			version: '1.0.1',
			company: 'Center for History and New Media',
			place: 'Fairfax, VA',
			url: 'http://www.zotero.org'
		};
		Zotero.Items.add('computerProgram', data); // returns a Zotero.Item instance
	}
};

// Initialize the utility
window.addEventListener('load', function(e) { Zotero.HelloWorldZotero.init(); }, false);
