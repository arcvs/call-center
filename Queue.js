function Queue(){
  this._storage = {}
  this._newestIndex = 1;
  this._oldestIndex = 1;
}

Queue.prototype.push = function(data){
  this._storage[this._newestIndex ++] = data
}

Queue.prototype.size = function(){
  return this._newestIndex - this._oldestIndex
}

Queue.prototype.storage = function(){
  return this._storage
}

Queue.prototype.pop = function(data){
  if (this._newestIndex != this._oldestIndex) {
    return delete this._storage[this._oldestIndex ++]
  } else {
    return null
  }
}

var q = new Queue();

q.push('122')
q.push('222')
q.push('322')
q.push('422')
q.pop()
q.pop()
q.push('522')
q.pop()
q.pop()
q.pop()
q.pop()
q.pop()

console.log(q.storage())
console.log(q.size())