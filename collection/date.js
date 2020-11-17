function getTimeGap() { // 获取当地时间与东八区的时差的 ms 数
    const UTCTime = new Date().toUTCString(); // 获取 UTC 时间, 东八区为 UTC+8
    const UTC8Timestamp = new Date(UTCTime).getTime() + 28800000; // 28800000 = (8h * 60 * 60 * 1000) ms
    const localTimestamp = new Date().getTime(); // 当地的时间的时间戳
    return UTC8Timestamp - localTimestamp;
}