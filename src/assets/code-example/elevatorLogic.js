var audioElement = $('#ding')[0];
var floorNumber = 20;
var elevatorNumber = 3;

var buildingHtml = '';
var elevatorsHtml = '';

var allElevators = [];

for (var i = 0; i < elevatorNumber; i++) {
    allElevators.push({
        id: i,
        available: true,
        floor: 0,
        duration: 0,
        timer: function () {
            var $elv = $('#elev_' + this.id);
            var int = setInterval(() => {

                $($elv).find('.timer').html(this.duration / 1000);
                this.duration -= 1000;
                if (this.duration / 100 <= 0) {
                    this.duration=0;
                    $($elv).find('.timer').html(this.duration / 1000);
                    clearInterval(int);
                }
            }, 1000)
        }
    })
}

for (var i = floorNumber; i >= 0; i--) {
    buildingHtml += `
         <div class="floor" id="floor_` + i + `">
            <button class="metal linear">` + i + `</button>
         </div>
         <div class="blackline"></div>
        `;
}

for (var i = 0; i < elevatorNumber; i++) {

    elevatorsHtml += `<div class="elevator-container">
                            <div class="elevator" id="elev_` + i + `">
                             <div class="timer" ></div>
</div>
                           
                         </div>`;
}

$('.building').append(buildingHtml);
var elevatorsHeight = $('.building').height();
$('.elevators').append(elevatorsHtml).height(elevatorsHeight);//.height(((floorNumber + 1) * 107) + 200);
$('.elevator-container').height(elevatorsHeight);


$(function () {
    $('body').on('click', '.metal.linear', function () {
        var $btn = $(this);

        $btn.addClass('active');

        var floor = parseInt($(this).text());

        var fromBotton = ((floor + 1) * 114) - 107;// Calc elevator distance from bottom

        var elevatorDuration = floor * 500;  //500 is half second
        var availableElv = null;


        availableElv = getClosetElv(allElevators, floor, floorNumber);

        if (availableElv) {
            availableElv.available = false;
            availableElv.duration = elevatorDuration;
            availableElv.timer();
            $($('.elevator')[availableElv.id]).animate({bottom: fromBotton}, {
                duration: elevatorDuration,
                complete: function () {
                    audioElement.play();
                    $btn.removeClass('active');
                    availableElv.floor = floor;
                    availableElv.available = true;
                    setTimeout(function () {

                        console.log('elevator available ' + availableElv.available);
                    }, 2000);

                }

            });
        }

    });

    function getClosetElv(elvList, floor, maxFloor) {
        var closet = maxFloor;
        var selectedElv;
        var retio = 0;
        elvList.forEach(function (elv) {
            if (elv.available) {

                if (elv.floor > floor) {
                    retio = elv.floor - floor;

                } else if (floor > elv.floor) {
                    retio = floor - elv.floor;
                }

                if (closet >= retio) {
                    closet = retio;

                    selectedElv = elv;
                }
            }

        });


        return selectedElv;
    }

})