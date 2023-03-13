# Terraform Progress Bar
#### * No installation required

### Demo 

![](https://github.com/tfbar/web/blob/main/npx-tfh.gif)

#### Also check out [Tree View Demo](https://www.youtube.com/watch?v=orrhT1PQYsw)

## Prerequisite
* Install [Node.js](https://nodejs.org/)

## How to use 

Add " **| npx github:tfbar/web** " after a command

For example:

Instead of entering
```
$ terraform plan
```
Enter
```
$ terraform plan | npx github:tfbar/web 
```

## Notes

* You may also use npx

```
$ terraform plan | npx tfh@latest
```
* On windows machine, prefer cmd over powershell for better experience

### Permenant Installation

#### In linux / mac 
Add the following line to your favorite shell config file: .zshrc, .bashrc, .bash_profile.
```
$ iterraform(){ terraform "$@" | npx github:tfbar/web }
```
Then use like this:
```
$ iterraform plan
```

#### In windows cmd 
* Create a batch file named *iterraform.bat* and paste the following into it
```
@ECHO OFF 
terraform %* | npx github:tfbar/web
```
* Add *iterraform.bat* to [system path](https://www.mathworks.com/matlabcentral/answers/94933-how-do-i-edit-my-system-path-in-windows)

Then use it like:
```
$ iterraform.bat apply
```

## Contributing

Pull requests are welcome. Feel free to...

- Revise documentation
- Add new features
- Fix bugs
- Suggest improvements

## License
[License](https://htmlpreview.github.io/?https://github.com/oferca/tf/blob/main/LICENSE) CC BY-NC-ND 4.0 <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz6HUcjVjf9BcSd19ld6N-catKylrVJSOU6A&usqp=CAU" height="12" width="55" />
