const equalsArray = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false
    const sortArr1 = arr1.sort()
    const sortArr2 = arr2.sort()
    for (let i = 0; i < sortArr1.length; i++) {
        if (sortArr1[i] !== sortArr2[i]) {
            return false
        }
    }
    return true
}

module.exports = { equalsArray }