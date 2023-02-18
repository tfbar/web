# Progress Bar for Terraform
Add an interactive progress bar to terraform commands.

  
<br/>

![](https://github.com/oferca/tf/blob/main/demo.gif)

## Prerequisite
* [Node.js](https://nodejs.org/)


## Installation options
### Zero-setup intallation
Pipe the output of any terraform command to *npx github:oferca/tf*, for example:

####  Windows cmd / linux / mac 
```
$ terraform plan | npx github:oferca/tf
```

### Permenant Installation
#### Linux / mac 
Add the following line to your favorite shell config file: .zshrc, .bashrc, .bash_profile.
```
$ tfi(){ terraform "$@" | npx github:oferca/tf  }
```
Then use like this
```
$ tfi plan
```

#### Windows cmd 
* Create a batch file named *tfi.bat* and paste the following into it
```
@ECHO OFF 
terraform %* -lock=false  | npx github:oferca/tf
```
* Add *tfi.bat* to [system path](https://www.mathworks.com/matlabcentral/answers/94933-how-do-i-edit-my-system-path-in-windows) and run like:
```
$ tfi.bat apply
```
## Pluginable Feeds
The progress bar comes with a Chuck Norris jokes feed out of the box.

However you can also configure custom feeds. You need an api that returns a json response with a "value" field, like [this api](https://api.chucknorris.io/).
Then configure it like this:

```
$ tfi(){ terraform "$@" | npx github:oferca/tf [Title] [Feed Url] }
```
For example: configure Bob quotes feed:
```
$ tfi(){ terraform "$@" | npx github:oferca/tf "Bob Quotes" "https://api.chucknorris.io/jokes/random?name=Bob" }
```
Disable feed completely:
```
$ tfi(){ terraform "$@" | npx github:oferca/tf disableFeed }
```

## Contributing

Pull requests are welcome. Feel free to...

- Revise documentation
- Add new features
- Fix bugs
- Suggest improvements

## License
[License](https://htmlpreview.github.io/?https://github.com/oferca/tf/blob/main/LICENSE) CC BY-NC-ND 4.0 <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz6HUcjVjf9BcSd19ld6N-catKylrVJSOU6A&usqp=CAU" height="12" width="55" />
