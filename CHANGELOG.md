# Changelog

## 1.0.5

#### Fixed

* Incrementing a media entry only updates progress the first time
* Incrementing a media entry that is marked as behind to a status that makes it not behind does not remove the marker
* Sidebar notification icon does not display current notification count until the task has run again

#### Added

* Completion of a media will now set the completion date

## 1.0.4

#### Fixed

* Notification page ignores most thread related notifications

#### Added

* Included version in the changelog title

## 1.0.3

#### Fixed

* About page refers to AniList as it's "parent" instead of it's "onii-chan"
* Logout button does not send you back to the login page
* Removed the ability to select text that shouldn't be selectable
* Removed margin around the logout button to bring it in line with other section contents

#### Added

* A changelog to the about page
* Notification icon now displays the notification count

#### Changed

* Login page now provides visual feedback upon being clicked
* Login page now transfers you to the media list page after a successful login
* The red line at the bottom of media cards of shows you're behind on have been changed to not be shit

## 1.0.2

#### Fixed

* Username in settings page does not use accent color
* Changing themes does not update all pages until the window is re-opened
* Avatar is not set upon login
* Implementation of background pages
  * Login button not working most of the time
  * Notification checker service not starting
* Empty media sections stay visible with "Loading..."
* Incrementing progress is sometimes handled multiple times from a single click

## 1.0.1

#### Fixed

* Fixed login page not showing up

#### Added

* The missing `identity` permission

## 1.0.0

* Initial release
