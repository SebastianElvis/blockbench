/**
 * Zipf Distribution Generator.
 * Logic originated from YCSB
 * @see https://github.com/brianfrankcooper/YCSB
 * As noted there,
 * The algorithm used here is from "Quickly Generating Billion-Record Synthetic
 * Databases", Jim Gray et al, SIGMOD 1994.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you                                                                                                             
 * may not use this file except in compliance with the License. You                                                                                                                
 * may obtain a copy of the License at                                                                                                                                             
 *                                                                                                                                                                                 
 * http://www.apache.org/licenses/LICENSE-2.0                                                                                                                                      
 *                                                                                                                                                                                 
 * Unless required by applicable law or agreed to in writing, software                                                                                                             
 * distributed under the License is distributed on an "AS IS" BASIS,                                                                                                               
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or                                                                                                                 
 * implied. See the License for the specific language governing                                                                                                                    
 * permissions and limitations under the License. See accompanying                                                                                                                 
 * LICENSE file.   
 */

/**
 * Create a zipf generator for item between min and max (inclusive) for the
 * specified constant, using a precomputed value of zeta.
 */
var ZipfianGenerator = function(min, max, constant, zetan) {
  this.items = max - min + 1;
  this.base = min;
  this.constant = constant || 0.99;

  this.zetan = zetan || this.getZeta(0, this.items, this.constant, 0);
  this.eta = (1 - Math.pow(2.0 / this.items, 1 - this.constant)) /
      (1 - this.getZeta(0, 2, this.constant, 0) / this.zetan);
};

/**
 * Compute the zeta constant needed for the distribution.
 * Calculated incrementally for a distribution that has n items now
 * but used to have st items. Uses the zipf constant theta.
 * @private
 */
ZipfianGenerator.prototype.getZeta = function(st,n,theta,isum) {
  var sum = isum, i;
  for (i = st; i < n; i += 1) {
    sum += 1.0 / Math.pow(i + 1, theta);
  }
  return sum;
};

/**
 * get the next float from the zipf distribution.
 */
ZipfianGenerator.prototype.next = function() {
  var u = Math.random();
  var uz = u * this.zetan;
  
  if (uz < 1.0) {
    return this.base;
  }
  return this.base + this.items * 
      Math.pow(this.eta * u - this.eta + 1, 1.0 / (1.0 - this.constant));
};

ZipfianGenerator.prototype.nextInt = function() {
  return Math.floor(this.next());
};

exports.ZipfianGenerator = ZipfianGenerator;

exports.getGenerator = function(items) {
  return new ZipfianGenerator(0, items);
};
