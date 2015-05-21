(function () {

  BookReader = (function() {

    function BookReader(options) {
      this.Container_constructor();

      this.stageD = {x: 0, y: 0, width: 1366, height: 768}

      if (options == null) {
          options = {};
        }
      this.x = (ref = options.x) != null ? ref : 280;
      this.y = (ref1 = options.y) != null ? ref1 : 10;
      this.pageWidth = (ref2 = options.pageWidth) != null ? ref2 : 470;
      this.pageHeight = (ref3 = options.pageHeight) != null ? ref3 : 748;
      this.pageGap = (ref4 = options.pageGap) != null ? ref4 : 0;
      this.maskWidth = (ref5 = options.maskWidth) != null ? ref5 : this.pageWidth * 2 + this.pageGap;
      initPages = (ref6 = options.numPages) != null ? ref6 : 0;
      startPage = (ref7 = options.startPage) != null ? ref7 : 0;
      initPages = Math.max(initPages, 2);
      this.masks = [];
      this.numPages = 0;
      this.allPages = [];
      this.currentPageNo = startPage - startPage % 2;
      this.addBlankPages(initPages);
      this._setupClickObject();
      this.showPage(this.currentPageNo);
    };

    var p = createjs.extend(BookReader, createjs.Container);

  // public properties:
    BookReader.DEBUG = false

  // public properties:
    //p.shipFlame;


  // public methods:
    p.handleClick = function(target) {
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
      this.addChild(page);
      this.allPages.push(page);
      this.numPages++;
    };

    p.getPage = function(i) {
      return this.allPages[i];
    };

    p.turnPage = function(direction) {
      var grad, increment, k, leftMask, leftPage, len, mask, pageNo, ref, rightMask, rightPage, time;
      increment = direction * 2;
      pageNo = this.currentPageNo + increment;
      if (pageNo < 0 || pageNo > this.numPages - 1) {
        console.log('BookReader: No more pages this way!!');
        return;
      }
      //this.playSound('page turn');
      time = .25;
      rightPage = this.allPages[pageNo + 1];
      leftPage = this.allPages[pageNo];

      console.log('BookReader: show pages', leftPage.name, rightPage.name);

      this.addChild(rightPage, leftPage);
      rightPage.visible = true;
      leftPage.visible = true;
      ref = this.masks;
      for (k = 0, len = ref.length; k < len; k++) {
        mask = ref[k];
        this.removeChild(mask);
      }
      if (direction === 1) {
        leftMask = this._addMask(this.x, this.y, "left");
        rightMask = this._addMask(this.x + this.maskWidth, this.y, "right");
        this.tweenMax.to(leftMask, time, {
          x: this.x - this.maskWidth + this.pageWidth + this.pageGap / 2,
          eases: this.eases.Power2.easeOut
        });
        this.tweenMax.to(rightMask, time, {
          x: this.x + this.pageWidth + this.pageGap / 2,
          eases: this.eases.Power2.easeOut
        });
        this.tweenMax.from(leftPage, time, {
          x: this.stageD.width - 100,
          eases: this.eases.Power1.easeOut
        });
        grad = this._addGradient("#000000", Graphics.getRGB(0, 0, 0, 0));
        grad.proportionalRegAndReposition(1, 0);
        rightPage.addChild(grad);
      } else {
        leftMask = this._addMask(this.x - this.maskWidth, this.y, "left");
        rightMask = this._addMask(this.x, this.y, "right");
        this.tweenMax.to(leftMask, time, {
          x: this.x - this.maskWidth + this.pageWidth + this.pageGap / 2,
          eases: this.eases.Power2.easeOut
        });
        this.tweenMax.to(rightMask, time, {
          x: this.x + this.pageWidth + this.pageGap / 2,
          eases: this.eases.Power2.easeOut
        });
        this.tweenMax.from(rightPage, time, {
          x: this.x - this.pageWidth,
          eases: this.eases.Power1.easeOut
        });
        grad = this._addGradient(Graphics.getRGB(0, 0, 0, 0), "#000000");
        leftPage.addChild(grad);
      }
      leftPage.mask = leftMask;
      rightPage.mask = rightMask;
      grad.scaleX = .5;
      this.tweenMax.to(grad, time * .9, {
        scaleX: 1,
        alpha: 0,
        eases: this.eases.Power3.easeOut
      });
      //this.stage.mouseEnabled = false;
      return this.delayedCall(time, (function(_this) {
        return function() {
          _this.stage.mouseEnabled = true;
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
      var clicker;
      clicker = new createjs.Container;
      //clicker.addHitArea(new createjs.Rectangle(0, 0, this.stageD.width, this.stageD.height));
      this.addChild(clicker);
      //clicker.onPress = this._handlePress;
      //clicker.onClick = this._handleClick;
    };

    p._handlePress = function(e) {
      return this.startX = e.stageX;
    };

    p._handleClick = function(e) {
      var clickable, distance, endX, findClickable, k, len, objUnderPoint, possibleCarousel, ref, threshold;
      findClickable = function(o) {
        while (o) {
          if (o.clickable) {
            return o;
          }
          o = o.parent;
        }
        return null;
      };
      threshold = 50;
      endX = e.stageX;
      distance = endX - this.startX;
      if (distance > threshold) {
        return this.turnPage(-1);
      } else if (distance < -threshold) {
        return this.turnPage(1);
      } else {
        ref = this.getObjectsUnderPoint(e.stageX, e.stageY);
        for (k = 0, len = ref.length; k < len; k++) {
          possibleCarousel = ref[k];
          clickable = findClickable(possibleCarousel);
          if ((clickable != null) && clickable.parent.visible) {
            objUnderPoint = clickable;
            break;
          }
        }
        if (objUnderPoint != null) {
          return this.handleClick(objUnderPoint);
        }
      }
    };

    p._addMask = function(x, y, side) {
      var color, h, mask, w;
      color = side === "left" ? "#ff0000" : "#ffff00";
      w = this.maskWidth;
      h = this.pageHeight;
      mask = ShapeUtil.makeRect(w, h, color);
      mask.alpha = .3;
      mask.set({
        x: x,
        y: y
      });
      this.masks.push(mask);
      return mask;
    };

    p._addGradient = function(c1, c2) {
      var g, h, s, w;
      w = this.pageWidth;
      h = this.pageHeight;
      g = new Graphics();
      g.beginLinearGradientFill([c1, c2], [0, 1], 0, 0, w, 0).drawRect(0, 0, w, h);
      s = new Shape(g);
      return s;
    };

    return createjs.promote(BookReader, "Container");

  })();



  Page = (function () {

    function Page(book, bounds) {
      this.Container_constructor();

      var grad, gradWidth, white;
      this.book = book;
      this.bounds = bounds;
      this.initialize();
      white = ShapeUtil.makeRect(this.bounds.width, this.bounds.height, "#ffffff", 0, "#000000");
      this.addChild(white);
      gradWidth = 40;
      grad = this._makeGradient(gradWidth, this.bounds.height);
      if (this.book.numPages % 2) {
        grad.scaleX = 1;
      } else {
        grad.x = this.bounds.width;
        grad.scaleX = -1;
      }
      this.addChild(grad);
      this.name = this.book.numPages;
      if (this.book.debug) {
        this.showPageNumber(this.book.numPages);
      }
    }

    var p2 = createjs.extend(Page, createjs.Container);

    p2.showPageNumber = function(num) {
      var txt;
      txt = new Text("" + num, "normal 20px Arial", "#000");
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
      g1.beginLinearGradientFill([Graphics.getRGB(0, 0, 0, 0), Graphics.getRGB(0, 0, 0, 0.5)], [1, 0], 0, 0, w, 0).drawRect(0, 0, w, h);
      s1 = new createjs.Shape(g1);
      g2 = new createjs.Graphics();
      g2.beginLinearGradientFill([Graphics.getRGB(0, 0, 0, 0), Graphics.getRGB(0, 0, 0, .7)], [1, 0], 0, 0, 3, 0).drawRect(0, 0, 10, h);
      s2 = new createjs.Shape(g2);
      cnt.addChild(s1, s2);
      cnt.cache(0, 0, w, h);
      return cnt;
    };

    return createjs.promote(Page, "Container");

  })();

}());




