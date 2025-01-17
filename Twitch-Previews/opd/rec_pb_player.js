async function main() {

    let isFirefox = typeof browser !== "undefined";
    let _browser = isFirefox ? browser : chrome;
    let options = {};

    const _tp_i18n = await import(_browser.runtime.getURL("./main/tp_i18n.js")).then((res) => {
        _browser.storage.local.get('tp_options', function(result) {
            options = result.tp_options;
            let items = document.querySelectorAll('[tp_i18n]');
            items.forEach((item) => {
                item.innerText = res.i18n[item.attributes.tp_i18n.value][options.selected_lang];
            })
        });
    });

    let file_input = document.getElementById('tp_select_file_input');
    let video = document.getElementById('vid');
    video.volume = 0.1;
    video.preload = "metadata";
    video.addEventListener("loadedmetadata", async function () {
        while (video.duration === Infinity) {
            await new Promise(r => setTimeout(r, 1000));
            video.currentTime = 10000000 * Math.random();
        }
        video.currentTime = 0;
    });

    document.getElementById('tp_select_file_btn').addEventListener('click', function (e) {
        file_input.click();
    });
    file_input.addEventListener('change', function (e) {
        let file = e.target.files[0];
        let blobURL = URL.createObjectURL(file);
        video.src = blobURL;
    });

    function showLoading() {
        document.getElementById('tp_loading').style.display = 'inline-block';
    }

    function hideLoading() {
        document.getElementById('tp_loading').style.display = 'none';
    }

    let dropZone = document.body;
    dropZone.addEventListener('dragover', function(e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    });
    dropZone.addEventListener('drop', function(e) {
        e.stopPropagation();
        e.preventDefault();
        let files = e.dataTransfer.files; // Array of all files

        for (let i=0, file; file=files[i]; i++) {
            if (file.type.match(/video.*/)) {
                showLoading();
                let reader = new FileReader();

                reader.onload = function(e2) {
                    video.src = e2.target.result;
                    setTimeout(function () {
                        hideLoading();
                    }, 1500);
                }

                reader.readAsDataURL(file);
            }
        }
    });


    _browser.runtime.sendMessage({action: 'bg_record_playback_player_show', detail: ""}, function(response) {

    });
}
main().then();