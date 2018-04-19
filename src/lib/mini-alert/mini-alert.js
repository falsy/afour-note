export default function miniAlert() {
  const $alertContainerId = $('#alert-container');
  const $alertBoxSeletor = $alertContainerId.children('div');
  const showTimer = 5000;
  const maxBoxLength = 4;
  let alertNo = 0;

  const removeAlertBox = (target) => {
    target.remove();
  };

  $.mAlert = (msg) => {
    const alertLength = $alertBoxSeletor.length;
    const thisAlertNo = alertNo;
    const alertBoxId = 'alert-box-' + thisAlertNo;
    
    if(alertLength > maxBoxLength) removeAlertBox($alertBoxSeletor.eq(0));

    $alertContainerId.append(
      '<div id="' + alertBoxId + '">' +
        '<span>' + msg + '</span>' +
      '</div>'
    );

    setTimeout(function(){
      removeAlertBox($('#'+alertBoxId));
    }, showTimer);

    return alertNo = alertNo + 1;
  };
}