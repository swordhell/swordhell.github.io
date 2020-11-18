### 概念
go语言中的并发程序通过两种手段来实现。goroutine和channel。顺序通讯进程（communicating sequential processes）简称CSP.
并发（concurrency）：逻辑上具备同时处理多个任务的能力。
并行（parallelism）：物理上再统一时刻执行多个并发任务。
### goroutine
简单将goroutine归纳为协程不合适。运行时会创建多个线程来执行并发任务，很像多线程和协程的综合体，能最大限度提升执行效率，发挥多核处理能力。
go语句，创建一个并发任务单元，放置再系统队列中，等待调度安排系统线程去获取执行权，当前流程不会阻塞，不会等待任务的启动。每个任务单元保存函数指针，参数，还会分配执行的栈内存，相对系统默认的MB级别的栈内存，goroutine栈只有2KB。
等待单独的退出事件可以直接使用channel来制作
```go
func main() {
    exit := make(chan struct{})
    go func() {
       time.Sleep(time.Second)
       fmt.Println("goroutine done.")
       close(exit)
    }()
    fmt.Println("main...")
    <- exit
    fmt.Println("main exit.")
}
```
如果需要等待多个指令可以使用
sync.WaitGroup来处理。
```go
var wg sync.WaitGroup
wg.Add(1)
wg.Done()
wg.Wait()
```
一些有用的函数
runtime.NumCPU 
查询服务器的cpu个数
runtime.GOMAXPROCS 
参数小于1，表示查询当前设置的值，否则就是设置参与并发的线程数。
runtime.Gosched 
暂停，释放线程去执行其他的任务，当前线程被放回队列，等待下次调度是恢复。
runtime.Goexit
在goroutine里面执行这个，将会终端任务，无论身处在哪一层，Goexit都能立即终止整个调用堆栈，这个和return退出当前函数不一样。但是不要在main函数里面调用这个函数,否则会直接panic。

### channel
通道是用于连接两个不同的线程。分为同步和异步的两种通道。
如果通道的长度为0，就是同步通道，就是需要等待处理方开始处理之后，才会执行后续操作。
如果通道长度>0，则是异步通道，投递了数据之后就能直接走了。
这个例子就是演示同步方式的通道，使用for来获取管道中的内容。
```golang
func main() {
    done := make(chan struct {})
    c := make(chan int)
    go func() {
        defer close(done)
        for x:=range c{
             fmt.Println(x)
        }
    }()
    c <- 1
    c <- 2
    c <-3
    close(c)
    <-done
}
```
通道默认是双向的。如果特殊情况下需要将通道的单向端获取出来，赋值给某个函数，控制其行为，只能单向，那就可以参考下面的代码
```golang
func main() {
      var wg sync.WaitGroup
      wg.Add(2)
      c := make(chan int)
      var send chan <- int = c
      var recv <- chan = c
      go func() {
          defer wg.Done()
          for x := range recv {
              println(x)
          }
     }()
     go func() {
          defer wg.Done()
          for i:=0;i<3;i++ {
               send <-I
         }
   }()
   wg.Wait()
}
```
这样就能把通道的单向通道赋值出来，  <-send或者 recv <- 1，语句就无法执行。
如果一个goroutine中要同时处理多个通道，可以选用select语句。它会随机选择一个可用通道收发操作。找一段leaf的源码来参考

```golang
// 构造一个有缓冲区的chan
...
var ChanCall  chan *CallInfo
...
ChanCall = make(chan *CallInfo, 1000)


func (s *Skeleton) Run(closeSig chan bool) {
	for {
		select {
		case <-closeSig:
			s.commandServer.Close()
			s.server.Close()
			for !s.g.Idle() || !s.client.Idle() {
				s.g.Close()
				s.client.Close()
			}
			return
		case ri := <-s.client.ChanAsynRet:
			s.client.Cb(ri)
		case ci := <-s.server.ChanCall:
			s.server.Exec(ci)
		case ci := <-s.commandServer.ChanCall:
			s.commandServer.Exec(ci)
		case cb := <-s.g.ChanCb:
			s.g.Cb(cb)
		case t := <-s.dispatcher.ChanTimer:
			t.Cb()
		}
	}
}
```
