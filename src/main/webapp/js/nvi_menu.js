(function($) {
  $(document).ready(function() {
    // 클릭 시 active 클래스 설정
    $('.cssmenu > ul > li > a').click(function() {
      $('.cssmenu li').removeClass('active');
      $(this).closest('li').addClass('active');
      
      var checkElement = $(this).next();
      if ((checkElement.is('ul')) && (checkElement.is(':visible'))) {
        $(this).closest('li').removeClass('active');
        checkElement.slideUp('normal');
      }
      if ((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
        $('.cssmenu ul ul:visible').slideUp('normal');
        checkElement.slideDown('normal');
      }
      if ($(this).closest('li').find('ul').children().length == 0) {
        return true;
      } else {
        return false;	
      }
    });

    // 페이지 로드 시 현재 URL에 따라 active 클래스 설정
    const currentPath = window.location.pathname;
    $('.cssmenu a').each(function() {
      const href = $(this).attr('href');
      if (href && currentPath.includes(href)) {
        // 하위 메뉴 활성화
    	$('.cssmenu li').removeClass('active');
        $(this).closest('li').addClass('active');
        
        // 상위 메뉴(.has-sub) 활성화 및 하위 메뉴 표시
        const parentHasSub = $(this).closest('.has-sub');
        if (parentHasSub.length) {
          parentHasSub.addClass('active'); // 상위 메뉴 활성화
          parentHasSub.find('ul').show(); // 하위 메뉴 노출
        }
      }
    });
  });
})(jQuery);
