// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      console.log('this.get(rowIndex): ', this.get(rowIndex));
      console.log('row index: ', rowIndex);
      console.log('array length: ', this.get('n'));
      console.log('column index: ', colIndex);
      console.log('this.get(colIndex): ', colIndex);
      console.log('test', this.get(2));
      console.log('this.rows: ', this.rows());
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var pieces = 0;
      for (var i = 0; i < this.get(rowIndex).length; i++) {
        pieces = pieces + this.get(rowIndex)[i];
      }
      return (pieces > 1); // fixme
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var conflicts = false;
      for (var i = 0; i < this.get('n'); i++) {
        if (this.hasRowConflictAt(i)) {
          conflicts = true;
        }
      }
      return conflicts; // fixme
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      // debugger;
      var counter = 0;
      // for (var i = 0; i < this.get('n'); i++) {
      //   counter = counter + this.get(i)[colIndex];
      // }
      // return counter > 1; // fixme
      for (var i = 0; i < this.rows().length; i++) {
        if (this.rows()[i][colIndex] === 1) {
          counter++;
        }
      }
      return (counter > 1);
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var conflicts = false;
      for (var i = 0; i < this.rows().length; i++) {
        if (this.hasColConflictAt(i)) {
          conflicts = true;
        }
      }
      return conflicts; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var counter = 0;
      var maj = majorDiagonalColumnIndexAtFirstRow;
      // debugger;
      for (var i = 0; i < this.rows().length; i++) {
        if ((Math.abs(maj) + i) > (this.rows().length - 1)) {
          break;
        }
        if (maj > 0) {
          if (this.rows()[i][i + maj] === 1) {
            counter++;
          }
        } else if (maj < 0) {
          if (this.rows()[i + Math.abs(maj)][i] === 1) {
            counter++;
          }
        } else if (maj === 0) {
          if (this.rows()[i][i] === 1) {
            counter++;
          }
        }
      }
      return (counter > 1); // fixme
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var n = this.get('n');
      for (var i = (-n + 1); i < this.rows().length; i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var counter = 0;
      var min = minorDiagonalColumnIndexAtFirstRow;
      // var orgRow;
      // var col;
      var n = this.get('n') - 1;
      if (min > n) {
        orgRow = n;
      } else {
        orgRow = min;
      }

      // if (rows === col) {

      // } else {
      //   baseCol = col;
      //   while (row !== col) {
      //     for () {

      //     }
      //   }
      // }

      for (var i = 0; i < orgRow + 1; i++) {
        // if row === col
        // break;
        // put break here if min < n and row === 0 and col === min then break.
        // put break if i === min
        if (min < 3) {
          if (this.rows()[min - i][i]) {
            counter++;
          }
        } else if (min > 2) {
          if (this.rows()[(this.get('n') - 1) - i][ i + (min - 3)]) {
            counter++;
          }
        }
      }
      /*
      for minor < 3
        rows (min - i)
        cols i
      for minor > 2
        rows (this.get('n')-1) - i
        cols i + (min - 3)
      */
      return (counter > 1); // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var n = this.get('n');
      if (n === 1) {
        for (var i = 0; i < n; i++) {
          if (this.hasMinorDiagonalConflictAt(i)) {
            return true;
          }
        }
      } else if (n === 2) {
        for (var i = 0; i < n + 1; i++) {
          if (this.hasMinorDiagonalConflictAt(i)) {
            return true;
          }
        }
      } else {
        for (var i = 0; i < n + 2; i++) {
          if (this.hasMinorDiagonalConflictAt(i)) {
            return true;
          }
        }
      }
      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
