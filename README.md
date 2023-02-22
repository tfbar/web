# Terraform Progress Bar
**A progress bar to terraform commands.**

Utilize your time better waiting for those endless terraform outputs.

Watch progress and receieve insights and statistics.

*Complete log is available any time at the click of a button*

  
<br/>

![](https://github.com/oferca/tf/blob/main/demo.gif)

## Prerequisite
* Install [Node.js](https://nodejs.org/)


## Setup options
### Option 1: Zero Setup
Watch it in action by adding "*npx github:oferca/tf*" to any command.

For example:

####  In windows cmd / linux / mac 
```
$ terraform plan | npx github:oferca/tf
```

### Option 2: Permenant Installation
#### In linux / mac 
Add the following line to your favorite shell config file: .zshrc, .bashrc, .bash_profile.
```
$ iterraform(){ terraform "$@" | npx github:oferca/tf  }
```
Then use it:
```
$ iterraform plan
```

#### In windows cmd 
* Create a batch file named *iterraform.bat* and paste the following into it
```
@ECHO OFF 
terraform %* | npx github:oferca/tf
```
* Add *iterraform.bat* to [system path](https://www.mathworks.com/matlabcentral/answers/94933-how-do-i-edit-my-system-path-in-windows)

Then use it like:
```
$ iterraform.bat apply
```
## Pluginable Feeds
The progress bar comes with a Chuck Norris jokes feed out of the box.

However you can also configure custom feeds. You need an api that returns a json response with a "value" field, like [this api](https://api.chucknorris.io/).
Then configure it like this:

```
$ iterraform(){ terraform "$@" | npx github:oferca/tf [Title] [Feed Url] }
```
For example: configure Bob quotes feed:
```
$ iterraform(){ terraform "$@" | npx github:oferca/tf "Bob Quotes" "https://api.chucknorris.io/jokes/random?name=Bob" }
```
Disable feed completely:
```
$ iterraform(){ terraform "$@" | npx github:oferca/tf disableFeed }
```

## Contributing

Pull requests are welcome. Feel free to...

- Revise documentation
- Add new features
- Fix bugs
- Suggest improvements

## License
[License](https://htmlpreview.github.io/?https://github.com/oferca/tf/blob/main/LICENSE) CC BY-NC-ND 4.0 <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz6HUcjVjf9BcSd19ld6N-catKylrVJSOU6A&usqp=CAU" height="12" width="55" />
