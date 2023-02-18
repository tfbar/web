# Progress Bar for Terraform
Add a progress bar to terraform commands.

## Prerequisites
* [Node.js](https://nodejs.org/)


## Zero-step setup
Pipe the output like this:
```
$ terraform plan | npx github:oferca/tf
```
Which looks like:

![](https://github.com/oferca/tf/blob/main/demo.gif)

## Permenant Installation
Type in terminal:
```
$ tfi(){ terraform "$@" | npx github:oferca/tf  }
```
Also add the line to your favorite shell file: .zshrc, .bashrc, .bash_profile.

Then you can see see the progress bar by using "tfi" for terraform commands like this
```
$ tfi plan
```
or
```
$ tfi apply
```
## Pluginable Feeds
The progress bar comes with a Chuck Norris jokes feed out of the box. However custom feeds can be configured:
```
$ tfi(){ terraform "$@" | npx github:oferca/tf [Title] [Feed Url] }
```
Example: configure Bob quotes feed:
```
$ tfi(){ terraform "$@" | npx github:oferca/tf "Bob Quotes" "https://api.chucknorris.io/jokes/random?name=Bob" }
```
Disable completely
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
