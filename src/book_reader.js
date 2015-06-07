(function () {

  BookReader = (function() {

    function BookReader(container, options) {
      this.container = container;
      this.stageD = {x: 0, y: 0, width: 1366, height: 768}

      if (options == null) {
          options = {};
        }
      this.x = (ref = options.x) != null ? ref : 0;
      this.y = (ref1 = options.y) != null ? ref1 : 0;
      this.pageWidth = (ref2 = options.pageWidth) != null ? ref2 : 470;
      this.pageHeight = (ref3 = options.pageHeight) != null ? ref3 : 748;
      this.pageGap = (ref4 = options.pageGap) != null ? ref4 : 0;
      this.maskWidth = (ref5 = options.maskWidth) != null ? ref5 : this.pageWidth * 2 + this.pageGap;
      initPages = (ref6 = options.numPages) != null ? ref6 : 2;
      startPage = (ref7 = options.startPage) != null ? ref7 : 0;
      initPages = Math.max(initPages, 2);
      // this._shadowLeft  = this._makeGradient(this.pageWidth, this.pageHeight, createjs.Graphics.getRGB(255, 0, 0, 1), createjs.Graphics.getRGB(255, 0, 0, 0))
      // this._shadowRight = this._makeGradient(this.pageWidth, this.pageHeight, createjs.Graphics.getRGB(255, 0, 0, 0), createjs.Graphics.getRGB(255, 0, 0, 1))
      this._shadowLeftBlack = this._makeGradient(this.pageWidth, this.pageHeight, createjs.Graphics.getRGB(0, 0, 0, 1), createjs.Graphics.getRGB(0, 0, 0, 1))
      this._shadowRightBlack = this._shadowLeftBlack.clone()
      this.masks = [];
      this.numPages = 0;
      this.allPages = [];
      this.currentPageNo = startPage - startPage % 2;
      this.addBlankPages(initPages);
      this._setupClickObject();
      this.showPage(this.currentPageNo);
    };

    var p = createjs.extend(BookReader, createjs.EventDispatcher);

  // public properties:
    BookReader.DEBUG = false

  // public properties:
    //p.shipFlame;


  // public methods:
    p.handleClick = function(target) {
      console.log("handleClick!!")
      if (target.pageNumber != null) {
        this.turnPage(-1 + target.pageNumber%2*2)
      }
      this.dispatchEvent("click", target);
    };

    p.showPage = function(i) {
      var j, k, ref, ref1, ref2;
      for (j = k = ref = this.currentPageNo, ref1 = this.currentPageNo + 1; ref <= ref1 ? k <= ref1 : k >= ref1; j = ref <= ref1 ? ++k : --k) {
        this.allPages[j].visible = false;
      }
      this.currentPageNo = i;
      this.allPages[i].visible = true;
      return (ref2 = this.allPages[i + 1]) != null ? ref2.visible = true : void 0;
    };

    p.addBlankPages = function(num) {
      var i, k, ref, results;
      if (num % 2) {
        num++;
      }
      results = [];
      for (i = k = 0, ref = num; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
        results.push(this.addBlankPage());
      }
      return results;
    };

    p.addBlankPage = function() {
      var page;
      page = new Page(this, {
        width: this.pageWidth,
        height: this.pageHeight
      });
      page.set({
        x: this.x + this.numPages % 2 * (this.pageWidth + this.pageGap),
        y: this.y
      });
      page.visible = false;
      page.clickable = true;
      this.container.addChild(page);
      this.allPages.push(page);
      this.numPages++;
    };

    p.getPage = function(i) {
      return this.allPages[i];
    };

    p.getPageContainer = function(i) {
      return this.allPages[i].container;
    }

    p.turnPage = function(direction) {
      var grad, increment, k, leftMask, leftPage, len, mask, pageNo, ref, rightMask, rightPage, time;
      increment = direction * 2;
      pageNo = this.currentPageNo + increment;
      if (pageNo < 0 || pageNo > this.numPages - 1) {
        console.log('BookReader: No more pages this way!!');
        return;
      }
      //this.playSound('page turn');
      time = .4;
      //time = 5
      console.log('pageNo', pageNo)
      rightPage = this.allPages[pageNo + 1];
      leftPage = this.allPages[pageNo];

      console.log('BookReader: show pages', leftPage.name, rightPage.name);

      this.container.addChild(rightPage, leftPage);
      rightPage.visible = true;
      leftPage.visible = true;
      ref = this.masks;
      for (k = 0, len = ref.length; k < len; k++) {
        mask = ref[k];
        this.container.removeChild(mask);
      }
      if (direction === 1) {
        leftMask = this._addMask(this.x, this.y, "left");
        rightMask = this._addMask(this.x + this.maskWidth, this.y, "right");
        TweenMax.to(leftMask, time, {
          x: this.x - this.maskWidth + this.pageWidth + this.pageGap / 2,
          ease: Power2.easeOut
        });
        TweenMax.to(rightMask, time, {
          x: this.x + this.pageWidth + this.pageGap / 2,
          ease: Power2.easeOut
        });
        TweenMax.from(leftPage, time, {
          x: this.stageD.width - this.pageWidth/2,
          ease: Power2.easeOut
        });
        // grad = this._shadowRight
        // grad.regX = this.pageWidth;
        // rightPage.addChild(grad);

        currentLeftPage = this.allPages[this.currentPageNo];
        currentLeftPage.addChild(this._shadowLeftBlack.set({alpha:1}));
        TweenMax.from(this._shadowLeftBlack, time*.8, {delay: time*.2, alpha: 0, ease: Power2.easeOut})

        rightPage.addChild(this._shadowRightBlack.set({alpha:1}));
        TweenMax.to(this._shadowRightBlack, time*.8, {alpha: 0, ease: Power2.easeOut})
      } else {
        leftMask = this._addMask(this.x - this.maskWidth, this.y, "left");
        rightMask = this._addMask(this.x, this.y, "right");
        TweenMax.to(leftMask, time, {
          x: this.x - this.maskWidth + this.pageWidth + this.pageGap / 2,
          ease: Power2.easeOut
        });
        TweenMax.to(rightMask, time, {
          x: this.x + this.pageWidth + this.pageGap / 2,
          ease: Power2.easeOut
        });
        TweenMax.from(rightPage, time, {
          x: this.x - this.pageWidth,
          ease: Power2.easeOut
        });
        // grad = this._shadowLeft
        // leftPage.addChild(grad);

        currentRightPage = this.allPages[this.currentPageNo+1];
        currentRightPage.addChild(this._shadowRightBlack.set({alpha:1}));
        TweenMax.from(this._shadowRightBlack, time*.8, {delay: time*.2, alpha: 0, ease: Power2.easeOut})

        leftPage.addChild(this._shadowLeftBlack.set({alpha:1}));
        TweenMax.to(this._shadowLeftBlack, time*.8, {alpha: 0, ease: Power2.easeOut})
      }
      leftPage.mask = leftMask;
      rightPage.mask = rightMask;
      // grad.scaleX = .5;
      // TweenMax.to(grad, time * .9, {
      //   scaleX: 1,
      //   alpha: 0,
      //   ease: Power3.easeOut
      // });
      //this.stage.mouseEnabled = false;
      TweenMax.delayedCall(time, (function(_this) {
        return function() {
         // _this.stage.mouseEnabled = true;
          _this.showPage(pageNo);
          _this.dispatchEvent("page-turn", _this.currentPageNo, _this.currentPageNo - increment);
        };
      })(this));
    };

    p.getWidth = function() {
      return this.maskWidth;
    };

    p.getHeight = function() {
      return this.pageHeight;
    };

    p._setupClickObject = function() {
      //var clicker;
      //clicker = new createjs.Container;
      //clicker.addHitArea(new createjs.Rectangle(0, 0, this.stageD.width, this.stageD.height));
      //this.addChild(clicker);
      this.container.addEventListener("mousedown", createjs.proxy(this._handlePress, this))
      this.container.addEventListener("click", createjs.proxy(this._handleClick, this))
    };

    p._handlePress = function(e) {
      console.log('mouse DOWN!')
      return this.startX = e.stageX;
    };

    findClickable = function(o) {
      while (o) {
        if (o.clickable) {
          return o;
        }
        o = o.parent;
      }
      return null;
    };

    p._handleClick = function(e) {
      console.log('mouse UP!')
      var threshold = 50;
      var endX = e.stageX;
      var distance = endX - this.startX;
      if (distance > threshold) {
        this.turnPage(-1);
      } else if (distance < -threshold) {
        this.turnPage(1);
      } else {
        var objUnderPoint;
        objects = e.currentTarget.getObjectsUnderPoint(e.stageX, e.stageY);
        for (k = 0, len = objects.length; k < len; k++) {
          possibleCarousel = objects[k];
          clickable = findClickable(possibleCarousel);
          if ((clickable != null) && clickable.parent.visible) {
            objUnderPoint = clickable;
            break;
          }
        }
        if (objUnderPoint != null) {
          this.handleClick(objUnderPoint);
        }
      }
    };

    makeRect = function(w, h, color) {
      g = new createjs.Graphics()
      g.beginFill(color)
       .drawRect(0, 0, w, h)
      s = new createjs.Shape(g)
      return s;
    }

    p._addMask = function(x, y, side) {
      var color, h, mask, w;
      color = side === "left" ? "#ff0000" : "#ffff00";
      w = this.maskWidth;
      h = this.pageHeight;
      mask = makeRect(w, h, color);
      mask.alpha = .3;
      mask.set({
        x: x,
        y: y
      });
      this.masks.push(mask);
      return mask;
    };

    p._makeGradient = function(w, h, c1, c2) {
      g = new createjs.Graphics();
      g.beginLinearGradientFill([c1, c2], [0, 1], 0, 0, w, 0).drawRect(0, 0, w, h);
      s = new createjs.Shape(g);
      return s;
    };

    return createjs.promote(BookReader, "EventDispatcher");

  })();



  Page = (function () {

    function Page(book, bounds) {
      this.Container_constructor();

      var grad, gradWidth, white;
      this.book = book;
      this.bounds = bounds;
      this.initialize();
      white = makeRect(this.bounds.width, this.bounds.height, "#ffffff");
      this.addChild(white);
      gradWidth = 40;
      if (book._gradientImage == null) {
        book._gradientImage = this._makeGradient(gradWidth, this.bounds.height)
      }
      grad = new createjs.Bitmap(book._gradientImage)
      if (this.book.numPages % 2) {
        grad.scaleX = 1;
      } else {
        grad.x = this.bounds.width;
        grad.scaleX = -1;
      }
      this.container = new createjs.Container();
      this.addChild(this.container, grad);
      this.pageNumber = this.book.numPages;
      if (this.book.debug) {
        this.showPageNumber(this.pageNumber);
      }
    }

    var p2 = createjs.extend(Page, createjs.Container);

    p2.showPageNumber = function(num) {
      var txt = new createjs.Text("" + num, "normal 20px Arial", "#000");
      txt.set({
        x: 0,
        y: 0
      });
      return this.addChild(txt);
    };

    p2._makeGradient = function(w, h) {
      var cnt, g1, g2, s1, s2;
      cnt = new createjs.Container;
      g1 = new createjs.Graphics();
      g1.beginLinearGradientFill([createjs.Graphics.getRGB(0, 0, 0, 0), createjs.Graphics.getRGB(0, 0, 0, 0.5)], [1, 0], 0, 0, w, 0).drawRect(0, 0, w, h);
      s1 = new createjs.Shape(g1);
      g2 = new createjs.Graphics();
      g2.beginLinearGradientFill([createjs.Graphics.getRGB(0, 0, 0, 0), createjs.Graphics.getRGB(0, 0, 0, .7)], [1, 0], 0, 0, 3, 0).drawRect(0, 0, 10, h);
      s2 = new createjs.Shape(g2);
      cnt.addChild(s1, s2);
      cnt.cache(0, 0, w, h);
      return cnt.cacheCanvas;
    };

    return createjs.promote(Page, "Container");

  })();

}());




